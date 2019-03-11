import { storageKeyEnum } from '../../models/storageKeyEnum';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { mediaDetail } from 'src/app/models/mediaDetail';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private nativeStorage: NativeStorage) { }


  private getItems(storageKeyEnum: storageKeyEnum): Promise<mediaDetail[]> {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(storageKeyEnum)
        .then(data => {
          let mediaDetails: mediaDetail[] = JSON.parse(data);
          resolve(mediaDetails);
        })
        .catch(err => reject(err));
    });
  }


  getFavoris(mediaDetail: mediaDetail): Promise<mediaDetail> {
    return new Promise((resolve, reject) => {
      this.getFavs().then(res => {
        const obj = this.matchObject(res, mediaDetail);
        resolve(obj);
      })
        .catch(err => {
          console.log("an error", err);
          reject(err);
        });
    });
  }

  getFavs(): Promise<mediaDetail[]> {
    return new Promise((resolve, reject) => {
      this.getItems(storageKeyEnum.favoris)
        .then(res => { resolve(res) })
        .catch(err => {
          const emptyValues: mediaDetail[] = new Array();
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

  setFavoris(mediaDetail: mediaDetail) {
    let searchData: mediaDetail[] = new Array();
    let mediaDetailFind: Promise<mediaDetail> = this.getFavoris(mediaDetail);

    mediaDetailFind.then(mediaDetailFound => {
      if (mediaDetailFound !== null || mediaDetailFound !== undefined) {
        this.getFavs()
          .then(res => {
            searchData = res != null ? res : new Array();
            searchData.push(mediaDetailFound);
            this.nativeStorage.setItem(storageKeyEnum.favoris, searchData).catch(err => console.error("error when set fav" + err));
          }).catch(err => console.error("erreur lors de la recuperation des favoris pour l'ajout", err))
      }
    }).catch(err => console.error("erreur lors de la recuperation du favoris pour l'ajout", err));
  }

  removeFavoris(mediaDetail: mediaDetail) {
    let favs: mediaDetail[] = new Array();
    this.getFavs().then(res => {
      favs = res;
      res.forEach((element, index) => { if (element === mediaDetail) favs.splice(index, 1) });
      this.nativeStorage.setItem(storageKeyEnum.favoris, favs).catch(err => console.log(err));
    }, err => console.error("erreur lors de la supression du favoris", err));
  }
}
