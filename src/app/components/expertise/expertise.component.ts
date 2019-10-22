import {Component, Input, OnInit} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {UserService} from '../../services/user.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ExpertiseService} from '../../services/expertise.service';
import {NumeralPipe} from 'ngx-numeral';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-expertise',
  templateUrl: './expertise.component.html',
  styleUrls: ['./expertise.component.css']
})
export class ExpertiseComponent implements OnInit {

  @Input() vehicle: any;

  vehicleExpertise: any = {};
  expertises: any[] = [];
  expertisesType: String[] = ['Carrocería','Interior de vehículo','Mecánica'];

  constructor(private vehicleService: VehicleService,
              private experticeServise: ExpertiseService,
              private userService: UserService,
              private snackbar: MatSnackBar,
              private utilService: UtilService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.experticeServise.getExpertises().valueChanges().subscribe(expertisesResp=>{
      this.expertises=expertisesResp;
      console.log(this.expertises);
    });
    this.vehicleService.getVehicleContent(this.vehicle.id,'expertise').valueChanges().subscribe(expertiseResp=>{
      this.vehicleExpertise=!!expertiseResp[0]?expertiseResp[0]:{}
    });
  }

  setType(val) {
    this.vehicleExpertise.type=val
  }

  createExpertise() {
    if(!this.vehicleExpertise.id){
      this.vehicleExpertise.id=Date.now();
    }else {
      this.vehicleExpertise.updateDate=Date.now();
    }
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id,this.vehicleExpertise,'expertise'),
    ]).then(()=>{
      this.snackbar.open('El peritaje para el vehivulo: '+ this.vehicle.id + ' a sido guardado con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }
}
