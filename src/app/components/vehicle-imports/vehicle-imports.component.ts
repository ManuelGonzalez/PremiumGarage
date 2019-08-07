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
  displayedColumns = ['date','description', 'import', 'actions'];
  vehicleImport: any = {};
  dataSource: MatTableDataSource<any>;
  finding: boolean = false;
  date: any = {};

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
  }

  ISOStringToLocalDateString(iso){
    return new Date(iso).toLocaleDateString();
  }

  sum(listImports){
    return listImports.map(imp=> new NumeralPipe(imp.import)).reduce((nrImportA,nrImportB)=>nrImportA.add(nrImportB.value())).value();
  }

  applyFilter(filterValue: string) {
    if(filterValue!=""){
      this.finding=true;
    }else{
      this.finding=false;
    }

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
    }else {
      this.vehicleImport.updateDate=Date.now();
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

  openDialogDeleteVehicleImport() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Deseas eliminar el archivo?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //this.deleteFile()
      }
    });
  }
}