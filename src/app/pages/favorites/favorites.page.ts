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
    this.setData();
  }

  private setData() {
    this.storage.getFavs().then(resultatStorage => {

      this.removeDisplayedFavNotInStorage(resultatStorage);

      let favStorageNotDisplayed: String[] = this.getStorageFavNotDisplaying(resultatStorage);

      if (favStorageNotDisplayed !== null && favStorageNotDisplayed !== undefined && favStorageNotDisplayed.length > 0) {
        favStorageNotDisplayed.forEach((value) => {
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

  doRefresh(event: any) {

    setTimeout(() => {
      this.setData();
      event.target.complete();
    }, 2000);
  }

  getStorageFavNotDisplaying(imdbIdStorages: String[]): String[] {
    let imdIdbNotDisplayingYet: String[] = new Array();

    let imdbIdOffFavoris: String[] = new Array();
    this.favoris.forEach((value) => imdbIdOffFavoris.push(value.imdbID));

    imdbIdStorages.forEach(idBdd => {
      if (imdbIdOffFavoris.indexOf(idBdd) < 0) {
        imdIdbNotDisplayingYet.push(idBdd);
      }
    })
    return imdIdbNotDisplayingYet;
  }

  removeDisplayedFavNotInStorage(favoritesStored: String[]) {
    if (favoritesStored === null || favoritesStored === undefined || favoritesStored.length <1) {
      this.favoris = new Array();
      return;
    }
    
    let favdisplayedToKeep : mediaDetail[] = new Array();
    for(const fav of this.favoris){
      if (favoritesStored.indexOf(fav.imdbID) >= 0) {
        favdisplayedToKeep.push(fav);
      }
    }
    this.favoris =  favdisplayedToKeep;
  }
}