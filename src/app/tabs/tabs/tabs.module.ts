import { RouterModule } from '@angular/router';
import { MediaDetailsPageModule } from './../../pages/media-details/media-details.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'tabs',
        component: TabsPage,
        children: [
          { path: 'movies', loadChildren: '../../pages/movies/movies.module#MoviesPageModule' },
          { path: 'series', loadChildren: '../../pages/series/series.module#SeriesPageModule' }
        ]
      }
    ]
    )
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
