import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';



@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform, private fileChooser: FileChooser,
    private file: File, private filePath: FilePath) {

  }

  private permissionForReadData: Boolean = false;
  private permissionForWriteData: Boolean = false;

  ExportData() {
    if (this.platform.is("android")) {
      if (this.permissionForWriteData) {

      } else {
        this.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(granted => {
          this.permissionForWriteData = granted;
          if (granted) {
            // logique
          }
        });
      }
    }
  }

  ExtractData() {
    if (this.platform.is("android")) {
      if (this.permissionForReadData) {

        this.fileChooser.open().then(
          filePath => {
            this.fileToText(filePath).then(res => console.log(res + "permisssion already ok "));
          }
        ).catch(err => console.error(err));

      } else {
        this.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(granted => {
          this.permissionForReadData = granted;
          if (granted) {
            this.fileChooser.open().then(
              filePath => {
                this.fileToText(filePath).then(res => console.log(res + "permisssion granted"));
              }
            ).catch(err => console.error(err));
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
          console.log("permission of" + permissionRequired + " already granted -> " + have.hasPermission);
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


  askPermission(permissionRequired: string): Promise<Boolean> {
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
      this.filePath.resolveNativePath(filepath).then(
        path => {
          const dir: string = this.getDirectoryFromPath(path);
          const filename: string = this.getFileNameFromPath(path);
          this.file.readAsText(dir, filename)
            .then(txt => {
              resolve(txt);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
  }

  private getDirectoryFromPath(filePath: string): string {
    return filePath.substring(0, filePath.lastIndexOf("/"));
  }

  private getFileNameFromPath(filePath: string): string {
    return filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length);
  }
}
