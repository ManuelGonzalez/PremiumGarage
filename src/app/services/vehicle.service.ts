import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Upload} from '../models/upload';
import {UploadService} from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  currentFiles: any[] = [];

  constructor(public afDB: AngularFireDatabase, private uploadServices: UploadService) { }

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

  pushVehicleFiles(upload: Upload,id: string){
    this.uploadServices.pushUpload(upload,"vehicles/"+id);
  }

  getVehicleFiles(id: string){
    return this.uploadServices.getFiles("vehicles/"+id).valueChanges()
  }

  deleteVehicleFile(id: string, upload: Upload){
    return Promise.all([
      this.uploadServices.deleteUpload(`vehicles/${id}/${upload.name}`),
      this.uploadServices.deleteFileData(`vehicles/${id}/${upload.id}`),
    ])
  }

  pushVehicleStateFiles(upload: Upload,id: string){
    this.uploadServices.pushUpload(upload,"vehiclesState/"+id);
  }

  getVehicleStateFiles(id: string){
    return this.uploadServices.getFiles("vehiclesState/"+id).valueChanges()
  }

  deleteVehicleStateFile(id: string, upload: Upload){
    return Promise.all([
      this.uploadServices.deleteUpload(`vehiclesState/${id}/${upload.name}`),
      this.uploadServices.deleteFileData(`vehiclesState/${id}/${upload.id}`),
    ])
  }

  deleteAllUserFile(id: string){
    this.getVehicleFiles(id).subscribe(files=>{
      this.currentFiles=files;
      this.currentFiles.map(file=>{
        this.deleteVehicleFile(id,file);
      });
    });
  }

  createOrUpdateVehicleContent(vehicleId,vehicleContent,pathContent){
    this.afDB.database.ref(`/vehicles/${vehicleId}/${pathContent}/${vehicleContent.id}`).set(vehicleContent);
  }

  getVehicleContent(vehicleId: string,pathContent: string){
    return this.afDB.list(`/vehicles/${vehicleId}/${pathContent}/`);
  }

  public deleteVehicleContent(id,vehicleId,pathContent: string){
    return this.afDB.database.ref(`/vehicles/${vehicleId}/${pathContent}/${id}`).remove();
  }

  verifyData(vehicle){

  }
  
}
