import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { LayoutComponent } from './layout/layout.component';
import { ContentLoaderService } from './services/content/content-loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private loader: ContentLoaderService,
    private el: ElementRef,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.updateHomeBodyClass(this.router.url);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => this.updateHomeBodyClass(event.urlAfterRedirects));

    afterNextRender(() => {
      // Primero marca como hidratado (elimina el flash)
      this.el.nativeElement.classList.add('hydrated');
    });
  }

  private updateHomeBodyClass(url: string): void {
    const path = url.split(/[?#]/, 1)[0];
    const segments = path.split('/').filter(Boolean);
    const isHome = segments.length <= 1;

    this.document.body.classList.toggle('home-page', isHome);
  }

  ngOnInit(): void {
    this.loader.loadInitialContent().subscribe({
      error: (err) => console.error('Content loading error', err),
    });
  }

  @HostListener('window:keydown.g')
  toggleGrid() {
    document.body.classList.toggle('show-grid');
  }
}
