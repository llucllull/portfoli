import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  host: {
    style: 'display: contents;'
  }
})
export class LegalComponent extends BasePageComponent {}
