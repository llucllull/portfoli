import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderClearComponent } from '@lluc_llull/ui-lib';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LayoutService } from '../services/layout/layout.service';

const COMPONENTS = [
  HeaderClearComponent,
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ...COMPONENTS],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly layoutService = inject(LayoutService);

  header$: Observable<any> = this.layoutService.header$;
  footer$: Observable<any> = this.layoutService.footer$;
}