import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasePageComponent } from '../../shared/base-page/base-page.component';
import { CategoryProgressComponent, HeroSectionComponent, SectionIntroComponent } from '@lluc_llull/ui-lib';

const COMPONENTS = [
  HeroSectionComponent,
  SectionIntroComponent,
  CategoryProgressComponent
];

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ...COMPONENTS],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent extends BasePageComponent {}
