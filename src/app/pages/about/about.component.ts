import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent extends BasePageComponent {}
