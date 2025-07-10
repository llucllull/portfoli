import { TopSliderComponent } from 'ui-lib';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

const COMPONENTS = [
  TopSliderComponent
];
@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ...COMPONENTS],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent {

}
