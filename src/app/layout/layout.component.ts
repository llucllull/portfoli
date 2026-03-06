import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BodyComponent, ScreenSizerService } from '@lluc_llull/ui-lib';
import { LayoutService } from '../services/layout/layout.service';
import { SiteConfigService } from '../services/site-config/site-config.service';
import { DynamicRendererComponent } from '../shared/dynamic-renderer/dynamic-renderer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutComponent {
  protected screen = inject(ScreenSizerService);
  private layoutService = inject(LayoutService);
  private siteConfig = inject(SiteConfigService);

  header$ = this.layoutService.header$;
  footer$ = this.layoutService.footer$;

  currentLang = this.siteConfig.getLanguage();

  mobileHeader(header: BodyComponent<any>): BodyComponent<any> {
    return {
      ...header,
      name: 'header-mobile',
    };
  }
}
