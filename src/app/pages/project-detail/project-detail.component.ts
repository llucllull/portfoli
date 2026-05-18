import { Component } from '@angular/core';
import { BasePageComponent } from '../../shared/base-page/base-page.component';
import { PAGE_IMPORTS } from '../../imports/page-imports';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: PAGE_IMPORTS,
  templateUrl: '../../shared/base-page/base-page.component.html',
  host: {
    style: 'display: contents;'
  }
})
export class ProjectDetailComponent extends BasePageComponent{

}
