import { Routes } from '@angular/router';
import { pageResolver } from './resolvers/page.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    resolve: { page: pageResolver },
  },

  {
    path: ':lang',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
        resolve: { page: pageResolver },
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then((m) => m.AboutComponent),
        resolve: { page: pageResolver },
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
        resolve: { page: pageResolver },
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(
            (m) => m.ProjectsComponent,
          ),
        resolve: { page: pageResolver },
      },

      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./pages/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
        resolve: { page: pageResolver },
      },

      {
        path: '**',
        loadComponent: () =>
          import('./pages/404/404.component').then((m) => m.ErrorComponent),
      },
    ],
  },
];
