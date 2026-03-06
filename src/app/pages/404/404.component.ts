import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  styleUrl: './404.component.scss',
})
export class ErrorComponent extends BasePageComponent {}
