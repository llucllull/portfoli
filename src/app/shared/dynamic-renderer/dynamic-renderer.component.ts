import {
  Component,
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

    for (const c of comps) {
      let component = COMPONENT_CACHE[c.name];

      if (!component) {
        const loader = COMPONENT_REGISTRY[c.name];

        if (!loader) {
          console.warn(`Component "${c.name}" not registered`);
          continue;
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

    this.rendering = false;
  }
}
