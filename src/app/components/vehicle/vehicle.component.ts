import {Component, OnInit, ViewChild} from '@angular/core';
import {CardService} from '../../services/cards.service';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {VehicleService} from '../../services/vehicle.service';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';

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
  displayedColumns: string[] = ['id', 'modelo', 'year' ,'establishment', 'addressReg', 'phoneReg', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cardService: CardService, private vehicleService: VehicleService, private snackbar: MatSnackBar) {
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
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.models.filter(option => option.toLowerCase().includes(filterValue));
  }

  setModels(){
    if(this.vehicle){
      this.vehicle.modelo="";
    }
    this.selectedBrand=this.brands.find(p=>p.id==this.vehicle.brand);
    this.models=this.selectedBrand.modelos;
  }

  blankVehicle(){
    this.vehicle={};
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
  }

  createVehicle(){
    if (this.isUpdate){
      this.vehicle.lastUpdate=Date.now();
    }else{
      this.vehicle.creationDate=Date.now();
    }
    this.vehicleService.createOrUpdateVehicle(this.vehicle).then(()=>{
      this.snackbar.open('El vehiculo: '+ this.vehicle.id + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
      this.blankVehicle();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
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

}
