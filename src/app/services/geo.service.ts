import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor(public afDB: AngularFireDatabase, private http: HttpClient) { }

  public getProvinces(){
    return this.afDB.list('/provincias/');
  }
}
