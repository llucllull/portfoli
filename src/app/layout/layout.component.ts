import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderClearComponent } from '@lluc_llull/ui-lib';

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
  
}