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
import {GeoService} from '../../services/geo.service';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {UtilService} from '../../services/util.service';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  type: any = null;
  vehicle: any = {};
  vehicles: any[] = [];
  brands: any[] = [];
  models: string[] = [];
  dataSource: MatTableDataSource<any>;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedBrand: any = {};
  isUpdate = false;
  displayedColumns: string[] = [];
  currentScreenWidth = '';
  flexMediaWatcher: Subscription;
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;
  loadFiles = false;
  file: any = {};
  files: any[] = [];
  address: any = {};
  vehicleStatesIn: string[] = ['Consignación', 'Permuta', 'Unidad Externa', 'Compra por inversión', 'Compra propia', 'Por reparación'];
  finding = false;
  date: any = {};

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myInput') myInputVariable: ElementRef;

  constructor(private route: ActivatedRoute,
              private cardService: CardService,
              private vehicleService: VehicleService,
              private geoService: GeoService,
              private utilServices: UtilService,
              private snackbar: MatSnackBar,
              private mediaObserver: MediaObserver,
              public dialog: MatDialog) {
    this.type = this.route.snapshot.params.type;
    this.vehicleService.getVehicles().valueChanges().subscribe(fbVeh => {
      this.vehicles = fbVeh;
      switch (this.type) {
        case 'expertise' : {
          this.vehicles = this.vehicles.filter(v => v.expertise);
          this.finding = true;
          break;
        }
      }
      this.dataSource = new MatTableDataSource(this.vehicles);
      this.dataSource = new MatTableDataSource(this.vehicles);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate =
        (data: any, filters: string) => {
          const matchFilter = [];
          const filterArray = filters.split(' ');
          const columns = (Object as any).values(data);
          // OR be more specific [data.name, data.race, data.color];

          // Main
          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(
              column => {
                customFilter.push(column.toString().toLowerCase().includes(filter));
              }
            );
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
          return matchFilter.every(Boolean); // AND
        };
    });
    this.cardService.getBrands().valueChanges().subscribe(fbBrands => {
      this.brands = fbBrands;
    });
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
  }

  handleAddressChange(address: Address) {
    this.address = this.utilServices.handleAddressChange(address);
    this.vehicle.postalCode = this.address.address_components[6].long_name;
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.date = new Date();
  }

  applyFilter(filterValue: string) {
    if (filterValue !== '') {
      this.finding = true;
    } else {
      this.finding = false;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.models.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  setModels() {
    if (this.vehicle) {
      this.vehicle.modelo = '';
    }
    this.selectedBrand = this.brands.find(p => p.id == this.vehicle.brand);
    this.models = this.selectedBrand.modelos;
    console.log(this.models);
  }

  setupTable() {
    switch (this.currentScreenWidth) {
      case 'xs':
        this.displayedColumns = ['cuil', 'domain', 'brand', 'actions'];
        this.displayedColumns.shift();
        break;
      case 'sm':
        this.displayedColumns = ['cuil', 'domain', 'brand', 'model', 'actions'];
        this.displayedColumns.shift();
        break;
      case 'md':
        this.displayedColumns = ['cuil', 'domain', 'brand', 'model' , 'year', 'actions'];
        this.displayedColumns.shift();
        break;
      default:
        this.displayedColumns = ['cuil', 'domain', 'brand', 'model' , 'year', 'actions'];
        this.displayedColumns.shift();
    }
  }

  blankVehicle() {
    this.vehicle = {};
    this.blanckInputfiles();
  }

  searchVehicle(id) {
    this.vehicleService.getVehicle(id).valueChanges().subscribe(fbVeh => {
      if (fbVeh != null) {
        this.isUpdate = true;
        this.vehicle = fbVeh;
      }
    });
  }

  setVehicle(vehicle) {
    this.isUpdate = true;
    this.vehicle = vehicle;
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
    this.vehicle.dateAdmission = this.date.toISOString();
    this.vehicle.addressRadicaction = this.address;
    Promise.all([
      this.uploadMulti(this.vehicle.id),
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(() => {
      this.snackbar.open('El vehiculo: ' + this.vehicle.id + ' a sido guardado con exito', 'Registro Guerdado', {
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

  deleteVehicle() {
    this.vehicleService.deleteVehicle(this.vehicle).then(() => {
      this.snackbar.open('El vehiculo: ' + this.vehicle.id + ' a sido eliminado', 'Delete', {
        duration: 5000
      });
      this.blankVehicle();
    }).catch(err => {
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
    if (this.selectedFiles) {
      this.loadFiles = true;
      const files = this.selectedFiles;
      const filesIndex = _.range(files.length);
      _.each(filesIndex, (idx) => {
        this.currentUpload = new Upload(files[idx]);
        this.vehicleService.pushVehicleFiles(this.currentUpload, id);
      });
    }
  }

  deleteFile() {
    this.vehicleService.deleteVehicleFile(this.vehicle.id, this.file).then(resp => {
      this.snackbar.open('El archivo: a sido eliminado', 'Delete', {
        duration: 5000
      });
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  setFile(file) {
    this.file = file;
  }

  blanckInputfiles() {
    this.myInputVariable.nativeElement.value = '';
    this.numberFiles = 0;
    const that = this;
    setTimeout(function(this) {
      that.loadFiles = false;
    }, 5000);
  }

  openDialogDeleteFile(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Deseas eliminar el archivo?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteFile();
      }
    });
  }

  openDialogDeleteVehicle(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Deseas eliminar el vehiculo: ${this.vehicle.id}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVehicle();
      }
    });
  }

}
