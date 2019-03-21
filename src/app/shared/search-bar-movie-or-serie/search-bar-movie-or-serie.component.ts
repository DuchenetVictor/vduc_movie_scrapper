import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { MediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { SearchMedia } from 'src/app/models/searchMedia';
import { RestApiService } from '../../services/rest-api/rest-api.service';
import { MediaDetail } from './../../models/mediaDetail';

@Component({
  selector: 'app-search-bar-movie-or-serie',
  templateUrl: './search-bar-movie-or-serie.component.html',
  styleUrls: ['./search-bar-movie-or-serie.component.scss']
})
export class SearchBarMovieOrSerieComponent implements OnInit {
  @Input() mediaType: MediaTypeEnum;
  @Input() searchBarVisibility: boolean;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public mediaDetails: MediaDetail[] = new Array();
  private actualPageNumber: number;
  private searchValue: String;
  private toggleIfinityScroll: Boolean;
  private totalResult: number;
  private numberPageMax: number;
  private numberResultByPage = 10;

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

    if (this.searchValue && this.searchValue.trim() !== '') {
      this.setMediaDetails();
      this.toggleIfinityScroll = true;
    } else {
      this.toggleIfinityScroll = false;
      this.resetItems();
    }
  }

  private setMediaDetails() {
    this.restApiService.getMedias<SearchMedia>(this.searchValue, this.mediaType, this.actualPageNumber).subscribe(data => {
      if (data != null) {
        this.mediaDetails = this.mediaDetails.concat(data.Search);

        if (this.totalResult === 0 || this.totalResult === undefined) {
          this.totalResult = Number.parseInt(data.totalResults);
          this.numberPageMax = this.calculateNbrPageMax();
        }
      }
    }, err => {
      console.error(err);
      this.resetItems();
    });
  }

  calculateNbrPageMax(): number {
    let result = this.totalResult / this.numberResultByPage;
    // get round number
    result = Number(result.toFixed());
    return result;
  }

  getMedia(mediaDetail: MediaDetail) {
    this.router.navigateByUrl('/media-details?param=' + mediaDetail.imdbID);
  }

  loadData(event) {

    setTimeout(() => {
      this.actualPageNumber++;
      this.setMediaDetails();
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.actualPageNumber === this.numberPageMax) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
