import { Component } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent extends BasePageComponent {}
