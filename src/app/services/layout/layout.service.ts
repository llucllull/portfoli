import { inject, Injectable, signal } from '@angular/core';
import { BodyComponent } from '@lluc_llull/ui-lib/interfaces';
import { MapperService } from '@lluc_llull/ui-lib/mapper';
import { resolveLang } from '../../utils/resolve-lang';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private mapper = inject(MapperService);

  private _header = signal<BodyComponent<any> | undefined>(undefined);
  private _footer = signal<BodyComponent<any> | undefined>(undefined);
  private _layoutLoaded = signal(false);
  private _footerRawProps: any;

  header = this._header.asReadonly();
  footer = this._footer.asReadonly();
  layoutLoaded = this._layoutLoaded.asReadonly();

  setHeader(component: BodyComponent<any>) {
    if (this._header()) return;

    this._header.set(component);
  }

  setFooter(component: BodyComponent<any>, rawProps?: any) {
    if (this._footer()) return;

    this._footerRawProps = rawProps;
    this._footer.set(component);
  }

  markLayoutAsLoaded() {
    if (this._layoutLoaded()) return;

    this._layoutLoaded.set(true);
  }

  resetLayout() {
    this._header.set(undefined);
    this._footer.set(undefined);
    this._footerRawProps = undefined;
    this._layoutLoaded.set(false);
  }

  updateHeaderLang(lang: string) {
    const header = this._header();
    if (!header) return;

    if (header.props?.lang === lang) return;

    this._header.set({
      ...header,
      props: {
        ...(header.props || {}),
        lang,
      },
    });
  }

  updateFooterLang(lang: string) {
    const footer = this._footer();
    if (!footer) return;

    if (footer.props?.lang === lang) return;

    if (this._footerRawProps) {
      const resolved = resolveLang(this._footerRawProps, lang);
      const mapped = this.mapper.mapComponents([
        {
          name: 'columns-footer',
          order: footer.order ?? 0,
          props: { ...resolved, lang },
        },
      ]);

      if (mapped[0]) {
        this._footer.set(mapped[0]);
      }
      return;
    }

    this._footer.set({
      ...footer,
      props: {
        ...(footer.props || {}),
        lang,
      },
    });
  }
}
