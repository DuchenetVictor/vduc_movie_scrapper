import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { StorageServiceService } from './../../services/storage-service.service';
import { mediaDetail } from './../../models/mediaDetail';
import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { mediaTypeEnum } from 'src/app/models/mediaTypeEnum';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Location } from '@angular/common';
import { storageKeyEnum } from 'src/app/models/storageKeyEnum';
import { empty } from 'rxjs';



@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.page.html',
  styleUrls: ['./media-details.page.scss'],
})
export class MediaDetailsPage implements OnInit {

  constructor(private router: Router, private platform: Platform, private restApi: RestApiService, private storage: StorageServiceService, private location: Location) { }

  private imdb: string;
  public media: mediaDetail;
  public seasons: string[];
  public isFavoris: boolean;

  ngOnInit() {

    this.imdb = this.platform.getQueryParam("param");

    this.storage.getFavoris(this.imdb).then(res => {
      if (res === undefined || res === null) {
        this.isFavoris = false;
      } else {
        this.isFavoris = true;
      }
    }).catch(err => {
      console.error("erreur lors de recuperation du favoris", err);
      this.isFavoris = false;
    });

    this.restApi.getMedia<mediaDetail>(this.imdb, mediaTypeEnum.serie).subscribe(
      (res) => {
        if (res != null) {
          this.media = res;
          if (res.totalSeasons != null) {
            this.seasons = this.transformeSeasonNbrIntoArray(res.totalSeasons);
          }
        }
      }, (err) => { console.log(err) });
  }

  transformeSeasonNbrIntoArray(seasonNbr: string): string[] {
    let arraySeasons: string[] = [];
    const number = Number(seasonNbr);
    for (let i = 0; i < number; i++) {
      arraySeasons[i] = (String(i + 1));
    }
    return arraySeasons;
  }

  buttonClick(nbr: string) {
    let navParam: NavigationExtras = {
      queryParams: {
        "imdb": this.imdb,
        "seasonNbr": nbr
      }
    };
    this.router.navigate(["season-details"], navParam);
  }

  comeBack() {
    this.location.back();
  }

  favorisClick(imdb: string) {
    if (!this.isFavoris) {
      this.storage.setFavoris(imdb);
    } else {
      this.storage.removeFavoris(imdb);
    }
    this.isFavoris = !this.isFavoris;
  }
}
