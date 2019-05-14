import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(public afDB: AngularFireDatabase) { }

  public getVehicles(){
    return this.afDB.list('/vehicles/');
  }

  public getVehicle(id: string){
    return this.afDB.object('/vehicles/'+id);
  }

  public createOrUpdateVehicle(vehicle){
    return this.afDB.database.ref('/vehicles/'+vehicle.id).set(vehicle);
  }

  public deleteVehicle(vehicle){
    return this.afDB.database.ref('/vehicles/'+vehicle.id).remove();
  }
  
}
