import { Component, ViewContainerRef, effect, input } from '@angular/core';

import { BodyComponent } from '@lluc_llull/ui-lib/interfaces';
import {
  COMPONENT_CACHE,
  COMPONENT_REGISTRY,
} from './component-registry.service';

@Component({
  selector: 'dynamic-renderer',
  standalone: true,
  template: '',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DynamicRendererComponent {
  components = input<BodyComponent<any>[]>([]);
  private rendering = false;

  constructor(private vcr: ViewContainerRef) {
    effect(() => {
      const comps = this.components();

      if (!comps?.length) {
        this.vcr.clear();
        return;
      }

      this.render(comps);
    });
  }

  private async render(comps: BodyComponent<any>[]) {
    if (this.rendering) return;

    this.rendering = true;
    this.vcr.clear();

    // Use requestIdleCallback for non-critical components
    const renderComponent = async (
      c: BodyComponent<any>,
      priority: 'high' | 'low' = 'high',
    ) => {
      if (priority === 'low' && 'requestIdleCallback' in window) {
        return new Promise<void>((resolve) => {
          requestIdleCallback(async () => {
            await this.createComponent(c);
            resolve();
          });
        });
      } else {
        await this.createComponent(c);
      }
    };

    // Render first component immediately, others with idle callback
    for (let i = 0; i < comps.length; i++) {
      const priority = i === 0 ? 'high' : 'low';
      await renderComponent(comps[i], priority);
    }

    this.rendering = false;
  }

  private async createComponent(c: BodyComponent<any>) {
    let component = COMPONENT_CACHE[c.name];

    if (!component) {
      const loader = COMPONENT_REGISTRY[c.name];

      if (!loader) {
        console.warn(`Component "${c.name}" not registered`);
        return;
      }

      component = await loader();
      COMPONENT_CACHE[c.name] = component;
    }

    const ref = this.vcr.createComponent(component);

    for (const key in c.props) {
      ref.setInput(key, c.props[key]);
    }

    if (c.events) {
      for (const key in c.events) {
        const emitter = ref.instance[key];
        if (emitter?.subscribe) {
          emitter.subscribe(c.events[key]);
        }
      }
    }
  }
}
