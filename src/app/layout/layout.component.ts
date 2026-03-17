import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BodyComponent } from '@lluc_llull/ui-lib/interfaces';
import { ScreenSizerService } from '@lluc_llull/ui-lib/screen-sizer';
import { LayoutService } from '../services/layout/layout.service';
import { SiteConfigService } from '../services/site-config/site-config.service';
import { DynamicRendererComponent } from '../shared/dynamic-renderer/dynamic-renderer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  protected screen = inject(ScreenSizerService);
  protected layout = inject(LayoutService);
  private siteConfig = inject(SiteConfigService);

  currentLang = this.siteConfig.getLanguage();

  mobileHeader = computed<BodyComponent<any>>(() => {
    const header = this.layout.header();

    return {
      ...header!,
      name: 'header-mobile',
    };
  });
}
