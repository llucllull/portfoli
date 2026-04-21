import { afterNextRender, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ContentLoaderService } from './services/content/content-loader.service';
import { preloadComponents } from './shared/dynamic-renderer/component-registry.service';

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
    private el: ElementRef
  ) {
    afterNextRender(() => {
      // Primero marca como hidratado (elimina el flash)
      this.el.nativeElement.classList.add('hydrated');
      // Luego precarga en background sin bloquear
      preloadComponents();
    });
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
