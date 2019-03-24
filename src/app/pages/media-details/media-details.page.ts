import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { MediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { RestApiService } from 'src/app/services/rest-api/rest-api.service';
import { StorageService } from '../../services/storage/storage.service';
import { MediaDetail } from './../../models/mediaDetail';
import { PlotEnum } from 'src/app/models/plotEnum';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss']
})
export class MediaDetailsPage implements OnInit {
  constructor(
    private router: Router,
    private platform: Platform,
    private restApi: RestApiService,
    private storage: StorageService,
    private location: Location
  ) {}

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  private imdb: string;
  public media: MediaDetail;
  public seasons: string[];
  public isFavoris: boolean;
  public linkPoster: String;

  ngOnInit() {
    this.imdb = this.platform.getQueryParam('param');

    this.restApi
      .getMedia<MediaDetail>(this.imdb, MediaTypeEnum.serie, null, null, PlotEnum.full)
      .subscribe(
        mediaDetailFromRest => {
          this.setMediaDetail(mediaDetailFromRest);
          this.setFavorisButton(mediaDetailFromRest);
        },
        err => {
          console.log(err);
        }
      );
    this.linkPoster = this.restApi.getposterLink(this.imdb, '1000');
  }

  private setFavorisButton(mDetail: MediaDetail) {
    this.storage
      .getFavoris(mDetail)
      .then(res => {
        if (res === undefined || res === null) {
          this.isFavoris = false;
        } else {
          this.isFavoris = true;
        }
      })
      .catch(err => {
        console.error('erreur lors de recuperation du favoris', err);
        this.isFavoris = false;
      });
  }

  private setMediaDetail(mediaDetailFound: MediaDetail) {
    if (mediaDetailFound != null) {
      this.media = mediaDetailFound;
      if (mediaDetailFound.totalSeasons != null) {
        this.seasons = this.transformeSeasonNbrIntoArray(
          mediaDetailFound.totalSeasons
        );
      }
    }
  }

  test(imdbID: string) {
    this.restApi.getPoster(imdbID).subscribe(rest => {});
  }

  transformeSeasonNbrIntoArray(seasonNbr: string): string[] {
    const arraySeasons: string[] = [];
    const number = Number(seasonNbr);
    for (let i = 0; i < number; i++) {
      arraySeasons[i] = String(i + 1);
    }
    return arraySeasons;
  }

  buttonClick(nbr: string) {
    const navParam: NavigationExtras = {
      queryParams: {
        imdb: this.imdb,
        seasonNbr: nbr
      }
    };
    this.router.navigate(['season-details'], navParam);
  }

  comeBack() {
    this.location.back();
  }

  favorisClick(mediaDetailToStore: MediaDetail) {
    if (!this.isFavoris) {
      this.storage.setFavoris(mediaDetailToStore);
    } else {
      this.storage.removeFavoris(mediaDetailToStore);
    }
    this.isFavoris = !this.isFavoris;
  }
}
