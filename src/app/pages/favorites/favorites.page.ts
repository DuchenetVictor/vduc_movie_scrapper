import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exportTypeEnum } from 'src/app/models/exportTypeEnum';
import { RestApiService } from 'src/app/services/rest-api/rest-api.service';
import { ShareService } from 'src/app/services/share/share.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { mediaDetail } from './../../models/mediaDetail';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  constructor(
    private storage: StorageService,
    private router: Router,
    private share: ShareService
  ) {}

  public favoris: mediaDetail[] = new Array();

  ngOnInit() {
    this.setData();
  }

  private setData() {
    this.storage
      .getAllFavoris()
      .then(resultatStorage => (this.favoris = resultatStorage));
  }

  getMedia(mediaDetailClicked: mediaDetail) {
    this.router.navigateByUrl(
      '/media-details?param=' + mediaDetailClicked.imdbID
    );
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.setData();
      event.target.complete();
    }, 2000);
  }

  downloadFav() {
    this.share.ExtractData<mediaDetail>().then(
      res => {
        res.forEach(fav => this.favoris.push(fav));
      },
      err => console.error(err)
    );
  }

  uploadFav() {
    this.share.ExportData<mediaDetail[]>(this.favoris, exportTypeEnum.JSON);
  }
}
