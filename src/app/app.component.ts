import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  constructor(private loader: ContentLoaderService) {}
  ngOnInit(): void {
    this.loader.loadInitialContent().subscribe({
      error: (err) => console.error('Content loading error', err),
    });
  }
}
