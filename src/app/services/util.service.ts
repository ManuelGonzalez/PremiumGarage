import { Injectable } from '@angular/core';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {NumeralPipe} from 'ngx-numeral';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  address: any = {};

  constructor() { }

  public handleAddressChange(address: Address) {
    this.address.id=address.id;
    this.address.name=address.name;
    this.address.url=address.url;
    this.address.address_components=address.address_components;

    return this.address;
  }

  sum(numbers){
    return numbers.map(imp=> new NumeralPipe(imp)).reduce((nrImportA,nrImportB)=>nrImportA.add(nrImportB.value())).value();
  }

}
