import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BodyComponent } from '@lluc_llull/ui-lib';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly header = signal<BodyComponent<any> | undefined>(undefined);
  private readonly footer = signal<BodyComponent<any> | undefined>(undefined);
  private readonly layoutLoaded = signal<boolean>(false);

  // Observables para templates que usan async pipe
  header$ = toObservable(this.header);
  footer$ = toObservable(this.footer);

  // getters
  get headerComponent() {
    return this.header();
  }

  get footerComponent() {
    return this.footer();
  }

  get layoutReady() {
    return this.layoutLoaded();
  }

  // setters
  setHeader(component: BodyComponent<any>) {
    this.header.set(component);
  }

  setFooter(component: BodyComponent<any>) {
    this.footer.set(component);
  }

  markLayoutAsLoaded() {
    this.layoutLoaded.set(true);
  }

  resetLayout() {
    this.header.set(undefined);
    this.footer.set(undefined);
    this.layoutLoaded.set(false);
  }

  updateHeaderLang(lang: string) {
    const header = this.header();

    if (!header) return;

    header.props = {
      ...(header.props || {}),
      lang,
    };

    // forzar re-render del signal
    this.header.set({ ...header });
  }
}
