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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BasePageComponent {}
