import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import * as _ from 'lodash';
import {Upload} from '../../models/upload';
import {MatSnackBar} from '@angular/material';
import {Address} from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() vehicle: any;
  @Input() isReport: boolean;
  @ViewChild('myInput') myInputVariable: ElementRef;

  isUpdate = false;
  address: any = {};
  vehicleStatesIn: string[] = ['Consignación', 'Permuta', 'Unidad Externa', 'Compra por inversión', 'Compra propia', 'Por reparación'];
  loadFiles = false;
  file: any = {};
  files: any[] = [];
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;

  constructor(private vehicleService: VehicleService,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
  }


  searchVehicle(id) {
    this.vehicleService.getVehicle(this.vehicle.id).valueChanges().subscribe(fbVeh => {
      if (fbVeh != null) {
        this.isUpdate = true;
        this.vehicle = fbVeh;
        this.vehicle.dateAdmission = this.vehicle.dateAdmission ? new Date(this.vehicle.dateAdmission) : new Date();
      }
    });
  }

  setVehicle(vehicle) {
    this.isUpdate = true;
    this.vehicle = vehicle;
    this.vehicle.dateAdmission = this.vehicle.dateAdmission ? new Date(this.vehicle.dateAdmission) : new Date();
    this.vehicleService.getVehicleFiles(vehicle.id).subscribe(files => {
      this.files = files;
    });
  }

  createVehicle() {
    if (this.isUpdate) {
      this.vehicle.lastUpdate = Date.now();
    } else {
      this.vehicle.creationDate = Date.now();
    }
    this.vehicle.dateAdmission = this.vehicle.dateAdmission ? this.vehicle.dateAdmission.toISOString() : '';
    this.vehicle.addressRadicaction = this.address;
    Promise.all([
      this.uploadMulti(this.vehicle.id),
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(() => {
      this.snackbar.open('El vehiculo: ' + this.vehicle.id + ' a sido guardado con exito', 'Registro Guardado', {
        duration: 5000
      });
      this.blankVehicle();
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(() => {
      this.blanckInputfiles();
    });
  }

  blanckInputfiles() {
    this.myInputVariable.nativeElement.value = '';
    this.numberFiles = 0;
    const that = this;
    setTimeout(function(this) {
      that.loadFiles = false;
    }, 5000);
  }

  blankVehicle() {
    this.blanckInputfiles();
  }

  uploadMulti(id) {
    if (this.selectedFiles) {
      this.loadFiles = true;
      const files = this.selectedFiles;
      const filesIndex = _.range(files.length);
      _.each(filesIndex, (idx) => {
        this.currentUpload = new Upload(files[idx]);
        this.vehicleService.pushVehicleStateFiles(this.currentUpload, id); }
      );
    }
  }

  public handleAddressChange(address: Address) {
    this.address.id = address.id;
    this.address.name = address.name;
    this.address.url = address.url;
    this.address.address_components = address.address_components;

    return this.address;
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.numberFiles = event.target.files.length;
  }

  ISOStringToLocalDateString(iso) {
    return new Date(iso).toLocaleDateString();
  }

}
