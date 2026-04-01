import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  hydrated = signal(false);

  ngOnInit() {
    // 🔥 clave: esperar a que Angular termine hydration
    requestAnimationFrame(() => {
      this.hydrated.set(true);
    });
  }
}
