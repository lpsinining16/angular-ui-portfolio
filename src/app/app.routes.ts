import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { initialDataResolver } from './core/resolvers/initial-data.resolver';

export const routes: Routes = [
  {
    // The default path ('/') will load the MainLayoutComponent,
    // which contains all of your page sections.
    path: '',
    component: MainLayout,

    resolve: {
      initialData: initialDataResolver
    }
  },
];
