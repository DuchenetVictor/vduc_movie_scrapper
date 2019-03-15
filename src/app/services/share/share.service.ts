import { ExportedCompilerFacade } from '@angular/compiler/src/compiler_facade_interface';
import { exportTypeEnum } from './../../models/exportTypeEnum';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ResolveEnd } from '@angular/router';

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

  ExportData<T>(data: T, exportType: exportTypeEnum) {
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

  private sendFavoris<T>(data: T, exportType: exportTypeEnum) {
    this.createFile(data, exportType).then(nativUrl => {
      this.socialSharing
        .share('favoris', null, nativUrl)
        .then(res => console.log(res))
        .catch(err => console.error(err));
    });
  }

  ExtractData() {
    if (this.platform.is('android')) {
      if (this.permissionForReadData) {
        this.fileChooser
          .open()
          .then(filePath => {
            this.fileToText(filePath).then(res =>
              console.log(res + 'permisssion already ok ')
            );
          })
          .catch(err => console.error(err));
      } else {
        this.checkPermission(
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
        ).then(granted => {
          this.permissionForReadData = granted;
          if (granted) {
            this.fileChooser
              .open()
              .then(filePath => {
                this.fileToText(filePath).then(res =>
                  console.log(res + 'permisssion granted')
                );
              })
              .catch(err => console.error(err));
          }
        });
      }
    }
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

  private fileToText(filepath: string): Promise<String> {
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

  private createFile<T>(data: T, exportType: exportTypeEnum): Promise<string> {
    return new Promise((resolve, reject) => {
      let filename = 'temp';

      let dataParsed: string;
      if (exportType === exportTypeEnum.CSV) {
        filename = filename.concat('.csv');
        // const csv : ngxCsv = new ngxCsv(data, 'exportFavoris', { noDownload : true});
        // console.log(csv);
        // csv.csv;
        // console.log(csv.formartData);
        // return csv;
      }

      if (exportType === exportTypeEnum.JSON) {
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
