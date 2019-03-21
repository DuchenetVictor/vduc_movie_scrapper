import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { MediaDetail } from 'src/app/models/mediaDetail';
import { StorageKeyEnum } from '../../models/storageKeyEnum';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private nativeStorage: NativeStorage) {}

  private getItems(
    storageKeyEnumForStorage: StorageKeyEnum
  ): Promise<MediaDetail[]> {
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
            const mediaDetails: MediaDetail[] = data;
            console.log('getITems', mediaDetails);
            resolve(mediaDetails);
          }
        },
        error => reject(error)
      );
    });
  }

  getFavoris(mediaDetailToFind: MediaDetail): Promise<MediaDetail> {
    return new Promise((resolve, reject) => {
      this.getAllFavoris()
        .then(res => {
          const mediaDetailFound: MediaDetail = this.matchMediaDetail(
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

  getAllFavoris(): Promise<MediaDetail[]> {
    return new Promise((resolve, reject) => {
      this.getItems(StorageKeyEnum.favoris)
        .then(res => {
          console.log('getAllFavoris', res);
          resolve(res);
        })
        .catch(err => {
          console.log('getAllFavoris errr ', err);
          const emptyValues: MediaDetail[] = new Array<MediaDetail>();
          this.nativeStorage.setItem(StorageKeyEnum.favoris, emptyValues).then(
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

  private matchMediaDetail(
    objsInDatabase: MediaDetail[],
    objToFind: MediaDetail
  ): MediaDetail {
    if (objsInDatabase === null || objsInDatabase === undefined) {
      return null;
    }
    for (const md of objsInDatabase) {
      if (md.imdbID === objToFind.imdbID) {
        return md;
      }
    }
  }

  setFavoris(mediaDetailToStore: MediaDetail) {
    const SearchedMediaDetail: Promise<MediaDetail> = this.getFavoris(
      mediaDetailToStore
    );

    SearchedMediaDetail.then(mediaDetailFound => {
      if (mediaDetailFound === null || mediaDetailFound === undefined) {
        mediaDetailFound = mediaDetailToStore;
        this.getAllFavoris()
          .then(res => {
            res.push(mediaDetailFound);
            this.nativeStorage
              .setItem(StorageKeyEnum.favoris, res)
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

  removeFavoris(mediaDetailToRemove: MediaDetail) {
    let favs: MediaDetail[] = new Array<MediaDetail>();
    this.getAllFavoris().then(
      res => {
        favs = res;
        res.forEach((element, index) => {
          if (element.imdbID === mediaDetailToRemove.imdbID) {
            favs.splice(index, 1);
          }
        });
        this.nativeStorage
          .setItem(StorageKeyEnum.favoris, favs)
          .then(
            () => console.log('remove done'),
            err => console.error('remove malfunction', err)
          );
      },
      err => console.error('erreur lors de la supression du favoris', err)
    );
  }

  findFavByImdbId(imdbIdToFind: string): Promise<MediaDetail> {
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

  removeAllFavoris() {
    const mediaDetailEmpty: MediaDetail[] = [];
    this.nativeStorage
      .setItem(StorageKeyEnum.favoris, mediaDetailEmpty)
      .then(
        () => console.log('remove all fav done'),
        err => console.error(err)
      );
  }
}
