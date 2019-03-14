import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { mediaDetail } from 'src/app/models/mediaDetail';
import { storageKeyEnum } from '../../models/storageKeyEnum';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private nativeStorage: NativeStorage) {}

  private getItems(
    storageKeyEnumForStorage: storageKeyEnum
  ): Promise<mediaDetail[]> {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(storageKeyEnumForStorage).then(
        data => {
          if (
            data === null ||
            data === undefined ||
            data === '[]' ||
            data.length < 1
          ) {
            reject('value returned empty');
          } else {
            console.log('data', data);
            const mediaDetails: mediaDetail[] = data;
            console.log('getITems', mediaDetails);
            resolve(mediaDetails);
          }
        },
        error => reject(error)
      );
    });
  }

  getFavoris(mediaDetailToFind: mediaDetail): Promise<mediaDetail> {
    return new Promise((resolve, reject) => {
      this.getAllFavoris()
        .then(res => {
          const mediaDetailFound: mediaDetail = this.matchMediaDetail(
            res,
            mediaDetailToFind
          );
          console.log('getFavoris', mediaDetailFound);
          resolve(mediaDetailFound);
        })
        .catch(err => {
          console.log('an error', err);
          reject(err);
        });
    });
  }

  getAllFavoris(): Promise<mediaDetail[]> {
    return new Promise((resolve, reject) => {
      this.getItems(storageKeyEnum.favoris)
        .then(res => {
          console.log('getAllFavoris', res);
          resolve(res);
        })
        .catch(err => {
          console.log('getAllFavoris errr ', err);
          const emptyValues: mediaDetail[] = new Array<mediaDetail>();
          this.nativeStorage.setItem(storageKeyEnum.favoris, emptyValues).then(
            res => {
              console.log('au secoure', res);
              resolve(emptyValues);
            },
            errAddBDD => console.error('au secoure errAddBDD', errAddBDD)
          );
          resolve(emptyValues);
        });
    });
  }

  private matchMediaDetail(objsInDatabase: mediaDetail[], objToFind: mediaDetail): mediaDetail {
    if (objsInDatabase === null || objsInDatabase === undefined) {
      return null;
    }
    for (const md of objsInDatabase) {
      if ( md.imdbID === objToFind.imdbID) {
        return md;
      }
    }
  }

  setFavoris(mediaDetailToStore: mediaDetail) {
    const SearchedMediaDetail: Promise<mediaDetail> = this.getFavoris(
      mediaDetailToStore
    );

    SearchedMediaDetail.then(mediaDetailFound => {
      if (mediaDetailFound === null || mediaDetailFound === undefined) {
        mediaDetailFound = mediaDetailToStore;
        this.getAllFavoris()
          .then(res => {
            res.push(mediaDetailFound);
            this.nativeStorage
              .setItem(storageKeyEnum.favoris, res)
              .then(() => console.log('item stored')),
              err => console.error('error while storing data', err);
          })
          .catch(err =>
            console.error(
              'erreur lors de la recuperation des favoris pour l\'ajout',
              err
            )
          );
      } else {
        console.log('object already in database', mediaDetailFound);
      }
    }).catch(err =>
      console.error(
        'erreur lors de la recuperation du favoris pour l\'ajout',
        err
      )
    );
  }

  removeFavoris(mediaDetailToRemove: mediaDetail) {
    let favs: mediaDetail[] = new Array<mediaDetail>();
    this.getAllFavoris().then(
      res => {
        favs = res;
        res.forEach((element, index) => {
          if (element.imdbID === mediaDetailToRemove.imdbID) {
            favs.splice(index, 1);
          }
        });
        this.nativeStorage
          .setItem(storageKeyEnum.favoris, favs)
          .then(
            () => console.log('remove done'),
            err => console.error('remove malfunction', err)
          );
      },
      err => console.error('erreur lors de la supression du favoris', err)
    );
  }

  findFavByImdbId(imdbIdToFind: string): Promise<mediaDetail> {
    return new Promise((resolve, reject) =>
      this.getAllFavoris().then(
        res => {
          for (const md of res) {
            if (md.imdbID === imdbIdToFind) {
              resolve(md);
            }
          }
        },
        err => reject(err)
      )
    );
  }
}
