import { SeriesPage } from './../../pages/series/series.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'movies',
        children: [
          {
            path: '',
            loadChildren: './../../pages/movies/movies.module#MoviesPageModule'
          }
        ]
      },
      {
        path: 'series',
        children: [
          {
            path: '',
            loadChildren: './../../pages/series/series.module#SeriesPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/pages/movies',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'pages/movies/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
