import { storageKeyEnum } from './../models/storageKeyEnum';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  constructor(private nativeStorage: NativeStorage) { }


  private getItems(storageKeyEnum: storageKeyEnum): Promise<String[]> {
    return this.nativeStorage.getItem(storageKeyEnum);
  }


  getFavoris(imdb: String): Promise<String> {
    return new Promise((resolve, reject) => {
      this.getFavs().then(res => {
        const obj = this.matchObject(res, imdb);
        resolve(obj);
      })
        .catch(err => {
          console.log("an error", err);
          reject(err);
        });
    });
  }

  getFavs(): Promise<String[]> {
    return new Promise((resolve, reject) => {
      this.getItems(storageKeyEnum.favoris)
        .then(res => { resolve(res) })
        .catch(err => {
          const emptyValues: String[] = new Array();
          this.nativeStorage.setItem(storageKeyEnum.favoris, emptyValues);

        })
    });
  }

  private matchObject<T>(objsInDatabase: T[], objToFind: T): T {
    if (objsInDatabase == null || objsInDatabase === undefined) return null;

    let obj: T = null;

    objsInDatabase.map((item) => {
      if (item === objToFind) {
        obj = item;
      }
    })[0];

    return obj;
  }

  setFavoris(imdb: String) {
    let searchData: String[];
    let imdbFind: Promise<String> = this.getFavoris(imdb);

    imdbFind.then(res => {

      if (res !== null || res !== undefined) {
        this.getFavs()
          .then(res => {
            if (res === undefined || res === null) {
              searchData = new Array();
            }
            searchData = res;
            searchData.push(imdb);

            this.nativeStorage.setItem(storageKeyEnum.favoris, searchData).catch(err => console.error("error when set fav" + err));
          })
          .catch(err => {
            console.error("erreur lors de la recuperation des favoris pour l'ajout", err);
          })
      }

    }).catch(err => {
      console.error("erreur lors de la recuperation du favoris pour l'ajout", err);
    });
  }

  removeFavoris(imdb: string) {
    let favs = new Array();
    this.getFavs().then(res => {
      favs = res;
      res.forEach((element, index) => { if (element === imdb) favs.splice(index, 1) });
      this.nativeStorage.setItem(storageKeyEnum.favoris, favs).catch(err => console.log(err));
    }, err => {
      console.error("erreur lors de la supression du favoris", err);

    });
  }
}
