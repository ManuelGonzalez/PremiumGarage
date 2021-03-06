import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(public afDB: AngularFireDatabase) { }

  public getProviders(){
    return this.afDB.list('/providers/');
  }

  public getProvider(id: string){
    return this.afDB.object('/providers/'+id);
  }

  public createOrUpdateProvider(provider){
    return this.afDB.database.ref('/providers/'+provider.id).set(provider);
  }

  public deleteProvider(id){
    return this.afDB.database.ref('/providers/'+id).remove();
  }

  public getRubros(){
    return this.afDB.list('/rubros/');
  }

}
