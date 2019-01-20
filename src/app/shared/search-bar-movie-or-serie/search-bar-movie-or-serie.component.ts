import { mediaDetail } from './../../models/mediaDetail';
import { RestApiService } from './../../services/rest-api.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { mediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { searchMedia } from 'src/app/models/searchMedia';

@Component({
  selector: 'app-search-bar-movie-or-serie',
  templateUrl: './search-bar-movie-or-serie.component.html',
  styleUrls: ['./search-bar-movie-or-serie.component.scss']
})
export class SearchBarMovieOrSerieComponent implements OnInit {
  @Input() mediaType: mediaTypeEnum;
  public mediaDetails: mediaDetail[];

  constructor(private router: Router, private restApiService: RestApiService) {
    this.initializeItems();
  }

  ngOnInit() {
  }
  initializeItems() {
    this.mediaDetails = [];
  }

  getItems(env: any) {
    this.initializeItems();
    const value = env.target.value;

    if (value && value.trim() != '') {
      this.restApiService.getMedias<searchMedia>(value, this.mediaType).subscribe(
        data => {
          if (data != null) {
            this.mediaDetails = data.Search;
          }
        },
        err => {
          console.log(err);
        });
    }
  }
  getMedia(mediaDetail : mediaDetail){
    if (this.mediaType === mediaTypeEnum.movie) {
      this.router.navigateByUrl("/movie-detail?param=" + mediaDetail.imdbID); //TODO: bonne route ! 
    }
    if (this.mediaType === mediaTypeEnum.serie) {
      this.router.navigateByUrl("/serie-details?param=" + mediaDetail.imdbID);//TODO bonne route :
    }
  }
}
