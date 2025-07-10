import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";
import { SiteConfigService } from './services/site-config/site-config.service';
import { RoutesService } from './services/routes/routes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'portfoli';

  constructor(
    private siteConfig: SiteConfigService,
    private routesService: RoutesService
  ) {}

  ngOnInit() {
    this.siteConfig.init().subscribe(() => {
      this.routesService.init().subscribe(() => {
        // Ja tens idiomes i rutes carregades
      });
    });
  }
}
