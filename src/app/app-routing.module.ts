import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo:'tabs', pathMatch:'prefix'},
  { path :'tabs', loadChildren: './tabs/tabs/tabs.module#TabsPageModule'},
  { path: 'media-details', loadChildren: './pages/media-details/media-details.module#MediaDetailsPageModule' },
  { path: 'season-details', loadChildren: './pages/season-details/season-details.module#SeasonDetailsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
