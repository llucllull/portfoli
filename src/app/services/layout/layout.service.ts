import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BodyComponent } from '@lluc_llull/ui-lib/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  private _header = signal<BodyComponent<any> | undefined>(undefined);
  private _footer = signal<BodyComponent<any> | undefined>(undefined);
  private _layoutLoaded = signal(false);

  header = this._header.asReadonly();
  footer = this._footer.asReadonly();
  layoutLoaded = this._layoutLoaded.asReadonly();

  setHeader(component: BodyComponent<any>) {
    this._header.set(component);
  }

  setFooter(component: BodyComponent<any>) {
    this._footer.set(component);
  }

  markLayoutAsLoaded() {
    this._layoutLoaded.set(true);
  }

  resetLayout() {
    this._header.set(undefined);
    this._footer.set(undefined);
    this._layoutLoaded.set(false);
  }

  updateHeaderLang(lang: string) {
    const header = this._header();
    if (!header) return;

    this._header.set({
      ...header,
      props: {
        ...(header.props || {}),
        lang,
      },
    });
  }

}