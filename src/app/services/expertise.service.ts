import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ExpertiseService {

  constructor(public afDB: AngularFireDatabase) { }

  public getExpertises(){
    return this.afDB.list('/expertise/');
  }

  public getExpertise(id: string){
    return this.afDB.object('/expertise/'+id);
  }

  public createOrUpdateExpertise(provider){
    return this.afDB.database.ref('/expertise/'+provider.id).set(provider);
  }

  public deleteExpertise(id){
    return this.afDB.database.ref('/expertise/'+id).remove();
  }

}
