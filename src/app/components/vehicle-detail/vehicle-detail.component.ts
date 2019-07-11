import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {GeoService} from '../../services/geo.service';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  id: any = null;
  vehicle: any;
  vehicleState: any = {};
  vehicleStates: any[] = [];
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  vehicleStatus: string[] = ['Reparacion', 'Mantenimiento', 'Transporte', 'Venta'];

  constructor(private route:ActivatedRoute, private vehicleService: VehicleService, geoService: GeoService){
    this.id = this.route.snapshot.params['id'];
    this.vehicleService.getVehicle(this.id).valueChanges().subscribe(vehResp=>{
      this.vehicle=vehResp;
    });
    this.vehicleService.getVehicleStates(this.id).valueChanges().subscribe(vehStatesResp=>{
      this.vehicleStates=vehStatesResp;
      console.log(this.vehicleStates);
    })
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
  }

  ngOnInit() {

  }

  formatDate(date){
    return new Date(date).toLocaleDateString('es-AR', this.options);
  }

  createStateVehicle() {
    if(!this.vehicleState.id){
      this.vehicleState.id=Date.now();
    }else {
      this.vehicleState.updateDate=Date.now();
    }
    this.vehicleService.createOrUpdateVehicleState(this.id,this.vehicleState);
    this.blankVehicleState();
  }

  blankVehicleState(){
    this.vehicleState={}
  }
}
