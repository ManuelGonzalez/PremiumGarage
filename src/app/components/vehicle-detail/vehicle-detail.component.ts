import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {ProviderService} from '../../services/provider.service';
import * as _ from 'lodash';
import {Upload} from '../../models/upload';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import { NumeralPipe } from 'ngx-numeral';

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
  vehicleImport: any = {};
  date: any = {};
  vehicleImports: any[] = [];
  vehicleImportsFilter: any[] = [];
  provider: any = {};
  providers: any[] = [];
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  vehicleStatus: string[] = ['Reparacion', 'Mantenimiento', 'Transporte', 'Bodega', 'GP Devoto', 'Venta'];
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;
  loadFiles=false;
  file: any = {};
  files: any[]= [];
  isUpdateImport: boolean = false;

  constructor(private route:ActivatedRoute,
              private vehicleService: VehicleService,
              private providerService: ProviderService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
    this.id = this.route.snapshot.params['id'];
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
  }

  getInfoProvider(providerId){
    if(this.providers.length>0){
      return this.providers.filter(p=>p.id==providerId)[0]
    }
  }

  getGMapsProviderLink(providerId) {
    const provider = this.getInfoProvider(providerId);
    return !!provider? provider.address.url + '&output=embed' : '';
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.id).valueChanges().subscribe(vehResp=>{
      this.vehicle=vehResp;
    });
    this.vehicleService.getVehicleContent(this.id,'states').valueChanges().subscribe(vehStatesResp=>{
      this.vehicleStates=vehStatesResp;
    });
    this.vehicleService.getVehicleContent(this.id,'imports').valueChanges().subscribe(vehImportsResp=>{
      this.vehicleImports=vehImportsResp;
    });
    this.providerService.getProviders().valueChanges().subscribe(provResp=>{
      this.providers=provResp;
    });
    this.date=new Date();
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
      this.vehicleService.createOrUpdateVehicleContent(this.id,this.vehicleState,'states'),
    ]).then(()=>{
      this.snackbar.open('El estado: '+ this.vehicleState.id + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blankVehicleContent();
    });
  }

  createImportsVehicle(stateId) {
    if(!this.vehicleImport.id){
      this.vehicleImport.id=Date.now();
    }else {
      this.vehicleImport.updateDate=Date.now();
    }
    this.vehicleImport.date=this.date.toISOString();
    this.vehicleImport.stateId=stateId;
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.id,this.vehicleImport,'imports'),
    ]).then(()=>{
      this.snackbar.open('El importe: '+ this.vehicleImport.id + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.setImportsByStateId(stateId,this.vehicleImport);
      this.blanckVehicleImport();
    });
  }

  blankVehicleContent(){
    this.vehicleState={};
    this.vehicleImport={};
    this.blanckInputfiles();
  }

  blanckVehicleImport(){
    this.date=new Date();
    this.isUpdateImport=false;
    this.vehicleImport={};
  }

  setState(state){
    this.vehicleState=state;
    this.vehicleService.getVehicleStateFiles(this.vehicleState.id).subscribe(files=>{
      this.files=files
    });
  }

  setImport(vehicleImport){
    this.isUpdateImport=true;
    this.vehicleImport=vehicleImport;
    this.date = new Date(this.vehicleImport.date);
  }

  ISOStringToLocalDateString(iso){
    return new Date(iso).toLocaleDateString();
  }

  setImportsByStateId(stateId,vehicleImport){
    this.vehicleImportsFilter=this.vehicleImports.filter(imp=>imp.stateId==stateId);
    if (vehicleImport&&!this.isUpdateImport)
      this.vehicleImportsFilter.push(vehicleImport);
  }

  sum(listImports){
    return listImports.map(imp=> new NumeralPipe(imp.import)).reduce((nrImportA,nrImportB)=>nrImportA.add(nrImportB.value())).value();
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
      case "GP Devoto":
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
