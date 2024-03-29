import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { ExportTypeEnum } from './../../models/exportTypeEnum';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private fileChooser: FileChooser,
    private file: File,
    private filePath: FilePath,
    private socialSharing: SocialSharing
  ) {}

  private permissionForReadData: Boolean = false;
  private permissionForWriteData: Boolean = false;

  ExportData<T>(data: T, exportType: ExportTypeEnum) {
    if (this.platform.is('android')) {
      if (this.permissionForWriteData) {
        this.sendFavoris(data, exportType);
      } else {
        this.checkPermission(
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ).then(granted => {
          this.permissionForWriteData = granted;
          if (granted) {
            this.sendFavoris(data, exportType);
          }
        });
      }
    }
  }

  ExtractData<T>(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android')) {
        if (this.permissionForReadData) {
          this.chooseFileAndExtractToObj<T>().then(res => {
            if (res !== null && res.length > 0) {
              console.log(' parsing json reussi ', res);
              resolve(res);
            } else {
              reject('le parsing en json n\'a pas marché');
            }
          });
        } else {
          this.checkPermission(
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          ).then(granted => {
            this.permissionForReadData = granted;
            if (granted) {
              this.chooseFileAndExtractToObj<T>().then(res => {
                if (res !== null && res.length > 0) {
                  console.log(' parsing json reussi ', res);
                  resolve(res);
                } else {
                  reject('le parsing en json n\'a pas marché');
                }
              });
            }
          });
        }
      }
    });
  }
  private chooseFileAndExtractToObj<T>(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.fileChooser
        .open()
        .then(filePath => {
          this.fileToText(filePath).then(res =>
            resolve(this.tryExtractJson(res))
          );
        })
        .catch(err => reject(err));
    });
  }

  private tryExtractJson<T>(textExtracted: string): T[] {
    let ts: T[] = JSON.parse(textExtracted);

    if (ts !== null || ts !== undefined) {
      return ts;
    }

    const t: T = JSON.parse(textExtracted);
    if (t !== null || t !== undefined) {
      ts = [];
      ts.push(t);
      return ts;
    }
    return null;
  }

  private sendFavoris<T>(data: T, exportType: ExportTypeEnum) {
    this.createFile(data, exportType).then(nativUrl => {
      this.socialSharing
        .share('favoris', null, nativUrl)
        .then(res => console.log(res))
        .catch(err => console.error(err));
    });
  }

  private checkPermission(permissionRequired: string): Promise<Boolean> {
    let permissionGranted: Boolean = false;
    return this.androidPermissions.checkPermission(permissionRequired).then(
      have => {
        if (have.hasPermission) {
          console.log(
            'permission of' +
              permissionRequired +
              ' already granted -> ' +
              have.hasPermission
          );
          permissionGranted = true;
        } else {
          return this.askPermission(permissionRequired);
        }
        return permissionGranted;
      },
      err => {
        return this.askPermission(permissionRequired);
      }
    );
  }

  private askPermission(permissionRequired: string): Promise<Boolean> {
    let permissionGranted: Boolean;
    return this.androidPermissions.requestPermission(permissionRequired).then(
      success => {
        permissionGranted = success;
        return permissionGranted;
      },
      err => {
        console.error(err);
        return false;
      }
    );
  }

  private fileToText(filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.filePath
        .resolveNativePath(filepath)
        .then(path => {
          const dir: string = this.getDirectoryFromPath(path);
          const filename: string = this.getFileNameFromPath(path);
          this.file
            .readAsText(dir, filename)
            .then(txt => {
              resolve(txt);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  private getDirectoryFromPath(filePath: string): string {
    return filePath.substring(0, filePath.lastIndexOf('/'));
  }

  private getFileNameFromPath(filePath: string): string {
    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  }

  private createFile<T>(data: T, exportType: ExportTypeEnum): Promise<string> {
    return new Promise((resolve, reject) => {
      let filename = 'temp';

      let dataParsed: string;
      if (exportType === ExportTypeEnum.CSV) {
        filename = filename.concat('.csv');
        // const csv : ngxCsv = new ngxCsv(data, 'exportFavoris', { noDownload : true});
        // console.log(csv);
        // csv.csv;
        // console.log(csv.formartData);
        // return csv;
      }

      if (exportType === ExportTypeEnum.JSON) {
        filename = filename.concat('.json');
        dataParsed = JSON.stringify(data);
      }

      this.file
        .writeFile(this.file.dataDirectory, filename, dataParsed, {
          replace: true
        })
        .then(res => resolve(res.nativeURL), err => reject(err));
    });
  }
}
