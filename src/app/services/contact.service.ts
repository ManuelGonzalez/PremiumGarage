import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(public afDB: AngularFireDatabase) { }

  public getContacts(){
    return this.afDB.list('/contacts/');
  }

  public getContact(id: string){
    return this.afDB.object('/contacts/'+id);
  }

  public createOrUpdateContact(contact){
    return this.afDB.database.ref('/contacts/'+contact.id).set(contact);
  }

  public deleteContact(contact){
    return this.afDB.database.ref('/contacts/'+contact.id).remove();
  }

}
