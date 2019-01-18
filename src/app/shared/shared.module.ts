import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarMovieOrSerieComponent } from './search-bar-movie-or-serie/search-bar-movie-or-serie.component';

@NgModule({
  declarations: [SearchBarMovieOrSerieComponent],
  exports: [SearchBarMovieOrSerieComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
