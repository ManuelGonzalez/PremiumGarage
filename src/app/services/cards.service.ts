import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(public afDB: AngularFireDatabase) { }

  public getBrands(){
    return this.afDB.list('/marcas/');
  }

  public createOpdateBrands(brand){
    return this.afDB.database.ref('/marcas/'+brand.id).set(brand);
  }

  public createOpdateModel(brand){
    return this.afDB.database.ref('/marcas/modelos/'+brand.modelo).set(brand);
  }

  public deleteBrand(brand){
    return this.afDB.database.ref('/marcas/'+brand.id).remove();
  }

  public deleteModel(brand){
    return this.afDB.database.ref('/marcas/modelos/'+brand.modelo).remove();
  }
}
