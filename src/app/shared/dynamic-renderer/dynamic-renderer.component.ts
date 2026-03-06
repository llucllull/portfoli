import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { BodyComponent } from '@lluc_llull/ui-lib';
import { COMPONENT_REGISTRY } from './component-registry.service';

@Component({
  selector: 'dynamic-renderer',
  standalone: true,
  template: '',
})
export class DynamicRendererComponent implements OnChanges {
  @Input() components: BodyComponent<any>[] = [];

  private vcr = inject(ViewContainerRef);
  private lastHash = '';

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['components']) return;
    if (!this.components?.length) return;

    const hash = JSON.stringify(this.components);

    if (hash === this.lastHash) return;

    this.lastHash = hash;

    this.render();
  }

  private async render() {
    this.vcr.clear();

    for (const c of this.components) {
      const loader = COMPONENT_REGISTRY[c.name];

      if (!loader) {
        console.warn(`Component "${c.name}" not registered`);
        continue;
      }

      const component = await loader();

      const ref = this.vcr.createComponent(component);

      Object.assign(ref.instance as any, c.props);

      ref.changeDetectorRef.detectChanges();
    }
  }
}
