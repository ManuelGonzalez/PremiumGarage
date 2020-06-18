import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UploadService} from './upload.service';
import {Upload} from '../models/upload';

const endpoint = 'https://afip.tangofactura.com/Index/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentFiles: any[] = [];
  currentFile: any = {};

  constructor(public afDB: AngularFireDatabase, private http: HttpClient, private uploadServices: UploadService) { }

  public getUsers() {
    return this.afDB.list('/users/');
  }

  public getUser(id: string) {
    return this.afDB.object('/users/' + id);
  }

  public createOrUpdateUser(user) {
    return this.afDB.database.ref('/users/' + user.id).set(user);
  }

  public deleteUser(user) {
    return this.afDB.database.ref('/users/' + user.id).remove();
  }

  getUserData(id) {
    return this.http.get(endpoint + '/GetFullContribuyente/?cuit=' + id);
  }

  getUserCuil(id) {
    return this.http.get(endpoint + '/GetCuitsPorDocumento/?NumeroDocumento=' + id);
  }

  pushUserFiles(upload: Upload, id: string) {
    this.uploadServices.pushUpload(upload, 'users/' + id);
  }

  getUserFiles(id: string) {
    return this.uploadServices.getFiles('users/' + id).valueChanges();
  }

  deleteUserFile(id: string, upload: Upload) {
    return Promise.all([
      this.uploadServices.deleteUpload(`users/${id}/${upload.name}`),
      this.uploadServices.deleteFileData(`users/${id}/${upload.id}`),
    ]);
  }

  deleteAllUserFile(id: string) {
    this.getUserFiles(id).subscribe(files => {
      this.currentFiles = files;
      this.currentFiles.map(file => {
        this.deleteUserFile(id, file);
      });
    });
  }
}
