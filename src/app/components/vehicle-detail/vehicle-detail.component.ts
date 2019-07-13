import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {GeoService} from '../../services/geo.service';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {ProviderService} from '../../services/provider.service';
import * as _ from 'lodash';
import {Upload} from '../../models/upload';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  @ViewChild('myInput') myInputVariable: ElementRef;

  id: any = null;
  vehicle: any;
  vehicleState: any = {};
  vehicleStates: any[] = [];
  provider: any = {};
  providers: any[] = [];
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  vehicleStatus: string[] = ['Reparacion', 'Mantenimiento', 'Transporte', 'Bodega', 'Garaje', 'Venta'];
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;
  loadFiles=false;
  file: any = {};
  files: any[]= [];

  constructor(private route:ActivatedRoute,
              private vehicleService: VehicleService,
              private providerService: ProviderService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
    this.id = this.route.snapshot.params['id'];
    this.vehicleService.getVehicle(this.id).valueChanges().subscribe(vehResp=>{
      this.vehicle=vehResp;
    });
    this.vehicleService.getVehicleStates(this.id).valueChanges().subscribe(vehStatesResp=>{
      this.vehicleStates=vehStatesResp;
    });
    this.providerService.getProviders().valueChanges().subscribe(provResp=>{
      this.providers=provResp;
    })
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
  }

  getInfoProvider(providerId){
    if(this.providers.length>0){
      return this.providers.filter(p=>p.id==providerId)[0]
    }
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
    Promise.all([
      this.uploadMulti(this.vehicleState.id),
      this.vehicleService.createOrUpdateVehicleState(this.id,this.vehicleState),
    ]).then(()=>{
      this.snackbar.open('El estado: '+ this.vehicleState.id + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
      this.blankVehicleState();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blanckInputfiles();
    });
    this.blankVehicleState();
  }

  blankVehicleState(){
    this.vehicleState={};
    this.blanckInputfiles();
  }

  setState(state){
    this.vehicleState=state;
    this.vehicleService.getVehicleStateFiles(this.vehicleState.id).subscribe(files=>{
      this.files=files
    });
  }

  getIconByState(state){
    let icon;
    switch (state) {
      case "Reparacion":
        icon = "fa-tools";
        break;
      case "Mantenimiento":
        icon="fa-toolbox";
       break;
      case "Transporte":
        icon="fa-car";
        break;
      case "Venta":
        icon = "fa-hand-holding-usd";
        break;
      case "Garaje":
        icon="fa-warehouse";
        break;
      case "Bodega":
        icon="fa-warehouse-alt";
        break;
    }
    return icon;
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.numberFiles = event.target.files.length;
  }

  uploadMulti(id) {
    if(this.selectedFiles){
      this.loadFiles=true;
      let files = this.selectedFiles;
      let filesIndex = _.range(files.length);
      _.each(filesIndex, (idx) => {
        this.currentUpload = new Upload(files[idx]);
        this.vehicleService.pushVehicleStateFiles(this.currentUpload,id)}
      )
    }
  }

  deleteFile(){
    this.vehicleService.deleteVehicleStateFile(this.vehicleState.id, this.file).then(resp=>{
      this.snackbar.open('El archivo: a sido eliminado', 'Delete', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  openDialogDeleteFile(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Deseas eliminar el archivo?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteFile()
      }
    });
  }

  setFile(file){
    this.file=file;
  }

  blanckInputfiles(){
    this.myInputVariable.nativeElement.value = "";
    this.numberFiles = 0;
    let that = this;
    setTimeout(function(this){
      that.loadFiles = false;
    },5000);
  }
}
