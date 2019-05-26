import { Injectable } from '@angular/core';
import {Upload} from '../models/upload';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private af: AngularFireModule, private db: AngularFireDatabase) { }

  private basePath = '/uploads/';
  uploads: FirebaseListObservable<Upload[]>;

  static formatFileName(name: string): string {
    return Date.now() + '.' + name.split('.')[1];
  }

  pushUpload(upload: Upload, path: string) {
    const storageRef = firebase.storage().ref();
    const name = UploadService.formatFileName(upload.file.name);
    const uploadTask = storageRef.child(`${this.basePath}${path}/${name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(resp => {
          upload.id = name.split('.')[0];
          upload.url = resp;
          upload.name = name;
          upload.type = upload.file.type;
          this.saveFileData(upload, path);
        });
      }
    );
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload, path: string) {
    this.db.list(`${this.basePath}${path}`).query.ref.child(upload.id).set(upload)
  }

  deleteUpload(path: string){
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}${path}`).delete()
  }

  deleteAllUploads(path: string){
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}${path}`).delete()
  }

  deleteFileData(path: string) {
    return this.db.list(`${this.basePath}${path}`).remove();
  }

  getFiles(path: string) {
    return this.db.list(`${this.basePath}${path}`);
  }

}
