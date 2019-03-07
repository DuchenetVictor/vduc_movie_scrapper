import { IonInfiniteScroll } from '@ionic/angular';
import { mediaDetail } from './../../models/mediaDetail';
import { RestApiService } from '../../services/rest-api/rest-api.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public mediaDetails: mediaDetail[] = new Array();
  private actualPageNumber: number;
  private searchValue: String;
  private toggleIfinityScroll: Boolean;
  private totalResult: number;
  private numberPageMax: number;
  private numberResultByPage: number = 10;

  constructor(private router: Router, private restApiService: RestApiService) {
    this.resetItems();
  }

  ngOnInit() {
    this.resetItems();
  }
  resetItems() {
    this.mediaDetails = new Array();
    this.actualPageNumber = 1;
    this.searchValue = '';
    this.toggleIfinityScroll = false;
    this.totalResult = 0;
    this.numberPageMax = 0;
  }

  getItems(env: any) {
    this.resetItems();
    this.searchValue = env.target.value;

    if (this.searchValue && this.searchValue.trim() != '') {
      this.setMediaDetails();
      this.toggleIfinityScroll = true;
    } else {
      this.toggleIfinityScroll = false;
      this.resetItems();
    }
  }

  private setMediaDetails() {
    this.restApiService.getMedias<searchMedia>(this.searchValue, this.mediaType, this.actualPageNumber).subscribe(data => {
      if (data != null) {
        this.mediaDetails = this.mediaDetails.concat(data.Search);

        if (this.totalResult === 0 || this.totalResult === undefined) {
          this.totalResult = Number.parseInt(data.totalResults);
          this.numberPageMax = this.calculateNbrPageMax();
        }
      }
    }, err => {
      console.log(err);
      this.resetItems();
    });
  }

  calculateNbrPageMax(): number {
    let result = this.totalResult / this.numberResultByPage;
    //get round number
    result = Number(result.toFixed());
    return result;
  }
  
  getMedia(mediaDetail: mediaDetail) {
    this.router.navigateByUrl("/media-details?param=" + mediaDetail.imdbID);
  }

  loadData(event) {

    setTimeout(() => {
      this.actualPageNumber++;
      this.setMediaDetails();
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.actualPageNumber == this.numberPageMax) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
