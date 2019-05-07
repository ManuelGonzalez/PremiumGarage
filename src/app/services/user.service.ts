import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  userData:any={};
  cuilData: any={};

  constructor(public afDB: AngularFireDatabase, private http: HttpClient) { }

  public getUsers(){
    return this.afDB.list('/users/');
  }

  public getUser(id: string){
    return this.afDB.object('/users/'+id);
  }

  public createOrUpdateUser(user){
    return this.afDB.database.ref('/users/'+user.id).set(user);
  }

  public deleteUser(user){
    this.afDB.database.ref('/users/'+user.id).remove();
  }

  getUserData(id) {
    return this.http.get(endpoint + '/GetFullContribuyente/?cuit='+id)
  }

  getUserCuil(id) {
    return this.http.get(endpoint + '/GetCuitsPorDocumento/?NumeroDocumento='+id)
  }
}
