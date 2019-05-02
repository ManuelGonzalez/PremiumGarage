import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public afDB: AngularFireDatabase) { }

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
}
