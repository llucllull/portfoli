import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';
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
  private rendered = false;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private vcr: ViewContainerRef) {
    effect(() => {
      const comps = this.components();
      if (!comps?.length) return; // Nunca limpiar si llega vacío
      // Limpiar componentes anteriores antes de re-renderizar
      this.vcr.clear();
      this.rendered = false;
      this.render(comps);
    });
  }

  private async render(comps: BodyComponent<any>[]) {
    this.rendered = true; // Se queda en true para siempre

    for (let i = 0; i < comps.length; i++) {
      const c = comps[i];
      const isFirst = i === 0;

      // requestIdleCallback solo en browser y solo para componentes no críticos
      if (!isFirst && this.isBrowser && 'requestIdleCallback' in window) {
        await new Promise<void>((resolve) => {
          requestIdleCallback(async () => {
            await this.createComponent(c);
            resolve();
          });
        });
      } else {
        await this.createComponent(c);
      }
    }
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
