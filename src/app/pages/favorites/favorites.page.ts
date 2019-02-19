import { Router } from '@angular/router';
import { mediaDetail } from './../../models/mediaDetail';
import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  constructor(private storage: StorageServiceService, private rest: RestApiService, private router: Router) { }

  public favoris: mediaDetail[] = new Array();

  ngOnInit() {
  }
  
  ionViewDidEnter() {  
    this.setData();
  }

  private setData() {
    this.storage.getFavs().then(resultatStorage => {

      resultatStorage = getStorageFavNotDisplaying(resultatStorage);
      if (resultatStorage !== null || resultatStorage !== undefined) {
        resultatStorage.forEach((value) => {

          this.rest.getMedia<mediaDetail>(value).subscribe(res => {
            this.favoris.push(res);
          }, err => {
            console.error("Erreur lors de la recuperation des favoris sur l'api", err);
          });
        });
      }
    }).catch(err => {
      console.error("Erreur lors de la recuperation des favoris en BDD", err);
    });
  }

  getMedia(mediaDetail: mediaDetail) {
    this.router.navigateByUrl("/media-details?param=" + mediaDetail.imdbID);
  }

  doRefresh(event: any){
    
    setTimeout(() => {
      this.setData();
      event.target.complete();
    }, 2000);
  }

  getStorageFavNotDisplaying(imdbIdStorages: String[]){
    imdbIdStorages.forEach((value, index)=>{
      if()
    })

  }
}
