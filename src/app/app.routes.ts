import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full'
  },

  {
    path: ':lang',
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent)
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then(m => m.AboutComponent)
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(m => m.ContactComponent)
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
      },

      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./pages/project-detail/project-detail.component')
            .then(m => m.ProjectDetailComponent)
      },

      {
        path: '**',
        loadComponent: () =>
          import('./pages/404/404.component').then(m => m.ErrorComponent)
      }

    ]
  }

];