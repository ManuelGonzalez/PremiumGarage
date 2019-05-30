import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CardService} from '../../services/cards.service';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import {Upload} from '../../models/upload';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicle: any = {};
  vehicles: any[] = [];
  brands: any[] = [];
  models: string[] = [];
  dataSource;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedBrand: any = {};
  isUpdate=false;
  displayedColumns: string[] = [];
  currentScreenWidth: string = '';
  flexMediaWatcher: Subscription;
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;
  loadFiles=false;
  file: any = {};
  files: any[]= [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myInput') myInputVariable: ElementRef;

  constructor(private cardService: CardService,
              private vehicleService: VehicleService,
              private snackbar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog) {
    this.vehicleService.getVehicles().valueChanges().subscribe(fbVeh=>{
      this.vehicles=fbVeh;
      this.dataSource = new MatTableDataSource(this.vehicles);
      this.dataSource = new MatTableDataSource(this.vehicles);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.cardService.getBrands().valueChanges().subscribe(fbBrands=>{
      this.brands=fbBrands;
    });
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setModels(){
    if(this.vehicle){
      this.vehicle.modelo="";
    }
    this.selectedBrand=this.brands.find(p=>p.id==this.vehicle.brand);
    this.models=this.selectedBrand.modelos;
  }

  setupTable() {
    switch (this.currentScreenWidth) {
      case 'xs':
        this.displayedColumns = ['id', 'modelo', 'year', 'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      case 'sm':
        this.displayedColumns = ['id', 'modelo', 'year', 'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      case 'md':
        this.displayedColumns = ['id', 'modelo', 'year' ,'establishment', 'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      default:
        this.displayedColumns = ['id', 'modelo', 'year' ,'establishment', 'addressReg', 'phoneReg', 'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
    }
  };

  blankVehicle(){
    this.vehicle={};
    this.blanckInputfiles();
  }

  searchVehicle(id){
    this.vehicleService.getVehicle(id).valueChanges().subscribe(fbVeh=>{
      if (fbVeh!=null){
        this.isUpdate=true;
        this.vehicle=fbVeh;
      }
    })
  }

  setVehicle(vehicle){
    this.isUpdate=true;
    this.vehicle=vehicle;
    this.vehicleService.getVehicleFiles(vehicle.id).subscribe(files=>{
      this.files=files
    })
  }

  createVehicle(){
    if (this.isUpdate){
      this.vehicle.lastUpdate=Date.now();
    }else{
      this.vehicle.creationDate=Date.now();
    }
    Promise.all([
      this.uploadMulti(this.vehicle.id),
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(()=>{
      this.snackbar.open('El vehiculo: '+ this.vehicle.id + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
      this.blankVehicle();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blanckInputfiles();
    });
  }

  deleteVehicle(){
    this.vehicleService.deleteVehicle(this.vehicle).then(()=>{
      this.snackbar.open('El vehiculo: '+ this.vehicle.id + ' a sido eliminado', 'Delete', {
        duration: 5000
      });
      this.blankVehicle();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.numberFiles = event.target.files.length;
  }

  uploadMulti(id) {
    this.loadFiles=true;
    let files = this.selectedFiles;
    let filesIndex = _.range(files.length);
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.vehicleService.pushVehicleFiles(this.currentUpload,id)}
    )
  }

  deleteFile(){
    this.vehicleService.deleteVehicleFile(this.vehicle.id, this.file).then(resp=>{
      this.snackbar.open('El archivo: a sido eliminado', 'Delete', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
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

  openDialogDeleteVehicle(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Deseas eliminar el vehiculo: ${this.vehicle.id}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteVehicle();
      }
    });
  }

}
