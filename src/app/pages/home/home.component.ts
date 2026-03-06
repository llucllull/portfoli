import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BasePageComponent {}
