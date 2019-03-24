import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportTypeEnum } from 'src/app/models/exportTypeEnum';
import { ShareService } from 'src/app/services/share/share.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MediaDetail } from './../../models/mediaDetail';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  constructor(
    private storage: StorageService,
    private router: Router,
    private share: ShareService,
    public actionSheetController: ActionSheetController
  ) {}

  public favoris: MediaDetail[] = new Array();

  ngOnInit() {
    this.setData();
  }

  private setData() {
    this.storage
      .getAllFavoris()
      .then(resultatStorage => (this.favoris = resultatStorage));
  }

  getMedia(mediaDetailClicked: MediaDetail) {
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

  uploadFav() {
    this.share.ExtractData<MediaDetail>().then(
      res => {
        this.storage.removeAllFavoris();
        this.favoris = res;
        res.forEach(fav => {
          this.storage.setFavoris(fav);
        });
      },
      err => console.error(err)
    );
  }

  downloadFav() {
    this.actionSheetController
      .create({
        header: ' type d\'export ',
        buttons: [
          {
            text: 'Annulé',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              console.log('Delete clicked');
            }
          },
          {
            text: 'CSV',
            icon: 'share',
            handler: () => {
              this.Export(ExportTypeEnum.CSV);
            }
          },
          {
            text: 'JSON',
            icon: 'share',
            handler: () => {
              this.Export(ExportTypeEnum.JSON);
            }
          }
        ]
      })
      .then(res => res.present());
  }

  private Export(exportType: ExportTypeEnum) {
    this.share.ExportData<MediaDetail[]>(
      this.cleanUselessData(this.favoris),
      exportType
    );
  }

  private cleanUselessData(datasToExport: MediaDetail[]): MediaDetail[] {
    const medias: MediaDetail[] = [];
    for (const mDetail of datasToExport) {
      const shortMediaDetail = new MediaDetail(mDetail.imdbID, mDetail.Title);
      medias.push(shortMediaDetail);
    }
    return medias;
  }
}
