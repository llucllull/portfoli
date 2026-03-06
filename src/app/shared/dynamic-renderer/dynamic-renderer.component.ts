import {
  Component,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';

import { BodyComponent } from '@lluc_llull/ui-lib';
import { COMPONENT_REGISTRY } from './component-registry.service';

@Component({
  selector: 'dynamic-renderer',
  standalone: true,
  template: '',
})
export class DynamicRendererComponent {
  components = input<BodyComponent<any>[]>([]);

  private vcr = inject(ViewContainerRef);
  private rendering = false;

  constructor() {
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
      const loader = COMPONENT_REGISTRY[c.name];

      if (!loader) {
        console.warn(`Component "${c.name}" not registered`);
        continue;
      }

      const component = await loader();
      const ref = this.vcr.createComponent(component);

      Object.assign(ref.instance as any, c.props);
    }

    this.rendering = false;
  }
}
