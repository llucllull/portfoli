import { Injectable, signal } from '@angular/core';
import { BodyComponent } from '@lluc_llull/ui-lib';

export type HeaderComponentName = 'headerClear';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly header = signal<BodyComponent<any> | undefined>(undefined);
  private readonly layoutLoaded = signal<boolean>(false);

  // Getters
  get headerComponent(): BodyComponent<any> | undefined {
    return this.header();
  }

  get layoutReady(): boolean {
    return this.layoutLoaded();
  }

  // Setters
  setHeader(component: BodyComponent<any>) {
    this.header.set(component);
  }

  markLayoutAsLoaded() {
    this.layoutLoaded.set(true);
  }

  resetLayout() {
    this.header.set(undefined);
    this.layoutLoaded.set(false);
  }
}
