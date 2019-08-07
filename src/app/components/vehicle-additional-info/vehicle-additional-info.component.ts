import {Component, Input, OnInit} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-vehicle-additional-info',
  templateUrl: './vehicle-additional-info.component.html',
  styleUrls: ['./vehicle-additional-info.component.css']
})
export class VehicleAdditionalInfoComponent implements OnInit {

  @Input() vehicle: any;
  vehicleAddInfo: any = {};

  constructor(private vehicleService: VehicleService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
  }

  ngOnInit() {
    this.vehicleService.getVehicleContent(this.vehicle.id,'addInfo').valueChanges().subscribe(vehImportsResp=>{
      this.vehicleAddInfo=!!vehImportsResp[0]?vehImportsResp[0]:{}
    });
  }

  createVehicleAddInfo(){
    if(!this.vehicleAddInfo.id){
      this.vehicleAddInfo.id=Date.now();
    }else {
      this.vehicleAddInfo.updateDate=Date.now();
    }
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id,this.vehicleAddInfo,'addInfo'),
    ]).then(()=>{
        this.snackbar.open('La informacion adicional para el vehivulo: '+ this.vehicle.id + ' a sido guardada con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }
}
