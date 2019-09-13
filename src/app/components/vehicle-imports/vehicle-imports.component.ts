import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {NumeralPipe} from 'ngx-numeral';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vehicle-imports',
  templateUrl: './vehicle-imports.component.html',
  styleUrls: ['./vehicle-imports.component.css']
})
export class VehicleImportsComponent implements OnInit {

  @Input() vehicle: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  vehicleImports: any[] = [];
  displayedColumns = [];
  vehicleImport: any = {};
  dataSource: MatTableDataSource<any>;
  date: any = {};
  importTypes: string[] = ['Documentación', 'Reparaciones', 'Traslados'];
  showInput: boolean = false;

  constructor(private vehicleService: VehicleService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
  }

  ngOnInit() {
    this.vehicleService.getVehicleContent(this.vehicle.id,'imports').valueChanges().subscribe(vehImportsResp=>{
      this.vehicleImports=vehImportsResp;
      this.dataSource = new MatTableDataSource(this.vehicleImports);
      this.dataSource = new MatTableDataSource(this.vehicleImports);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.date=new Date();
    this.displayedColumns = this.vehicle.stateIn ==="Consignación" ?
      ['date', 'description', 'importType', 'import', 'percentage', 'earnings', 'actions']:
      ['date', 'description', 'importType', 'import', 'actions'];
  }

  ISOStringToLocalDateString(iso){
    return new Date(iso).toLocaleDateString();
  }

  sum(listImports){
    return listImports.map(imp=> new NumeralPipe(imp.import)).reduce((nrImportA,nrImportB)=>nrImportA.add(nrImportB.value())).value();
  }

  sumPer(listImports){
    return listImports.map(imp=> new NumeralPipe(imp.percentage)).reduce((nrImportA,nrImportB)=>nrImportA.add(nrImportB.value())).value();
  }

  totalEarnings(listImports){
    let totalImport = this.sum(listImports)
    return new NumeralPipe(totalImport).multiply(this.sumPer(listImports)).divide(100).add(totalImport).value()
  }

  percentage(importVal,percentage){
    return new NumeralPipe(importVal).multiply(percentage).divide(100).add(importVal).value()
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  blankImport() {
    this.vehicleImport={}
  }

  createImportsVehicle() {
    if(!this.vehicleImport.id){
      this.vehicleImport.id=Date.now();
      this.vehicleImport.percentage=0;
    }else {
      this.vehicleImport.updateDate=Date.now();
      this.vehicleImport.percentage=this.vehicleImport.percentage>0?this.vehicleImport.percentage:0;
    }
    this.vehicleImport.date=this.date.toISOString();
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id,this.vehicleImport,'imports'),
    ]).then(()=>{
      this.snackbar.open('El importe: '+ this.vehicleImport.id + ' a sido guardado con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blankImport();
    });
  }

  setVehicleImport(vehicleImport) {
    this.vehicleImport=vehicleImport;
  }

  changeBool(){
    this.showInput=!this.showInput;
  }

  openDialogDeleteVehicleImport(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Deseas eliminar el importe?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteVehicleImport()
      }
    });
  }

  deleteVehicleImport(){
    Promise.all([
      this.vehicleService.deleteVehicleContent(this.vehicleImport.id,this.vehicle.id,'imports'),
    ]).then(()=>{
      this.snackbar.open('El importe: '+ this.vehicleImport.id + ' a sido eliminado con exito', 'Registro Eliminado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blankImport();
    });
  }

}
