import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [
//   { path: '', loadChildren: './tabs/tabs/tabs.module#TabsPageModule' },
//   { path: 'tabs/movies', loadChildren: './pages/movies/movies.module#MoviesPageModule' },
//   { path: 'tabs/series', loadChildren: './pages/series/series.module#SeriesPageModule' },
//   { path: 'media-details', loadChildren: './pages/media-details/media-details.module#MediaDetailsPageModule' },
//   { path: 'season-details', loadChildren: './pages/season-details/season-details.module#SeasonDetailsPageModule' }
// ];

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs/tabs.module#TabsPageModule'},
  { path: 'media-details', loadChildren: './pages/media-details/media-details.module#MediaDetailsPageModule' },
  { path: 'season-details', loadChildren: './pages/season-details/season-details.module#SeasonDetailsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
