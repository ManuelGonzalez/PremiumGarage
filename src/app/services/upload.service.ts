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

  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;

  pushUpload(upload: Upload,path: string) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(resp=>{
          upload.url = resp;
          upload.name = UploadService.formatFileName(upload.file.name);
          upload.type=upload.file.type;
          this.saveFileData(upload,path)
        });
      }
    );
  }

  static formatFileName(name: string): string{
    return Date.now()+"."+name.split(".")[1];
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload,path: string) {
    this.db.list(`${this.basePath}/${path}`).push(upload);
  }

  getFiles(path: string) {
    return this.db.list(`${this.basePath}/${path}`)
  }

}
