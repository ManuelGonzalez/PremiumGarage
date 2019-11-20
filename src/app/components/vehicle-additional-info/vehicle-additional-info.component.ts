import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {UserService} from '../../services/user.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vehicle-additional-info',
  templateUrl: './vehicle-additional-info.component.html',
  styleUrls: ['./vehicle-additional-info.component.css']
})
export class VehicleAdditionalInfoComponent implements OnInit {

  @Input() vehicle: any;
  @Input() isReport: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  vehicleAddInfo: any = {};
  users: any[] = [];
  seller: any = {};
  buyer: any = {};
  finding = false;
  displayedColumns = ['id', 'name', 'actions'];
  isSeller = false;
  dateAdmission: any = {};
  departureDate: any = {};
  policeCheckDate: any = {};
  report13Date: any = {};
  patentReportdDate: any = {};
  VTVDate: any = {};

  constructor(private vehicleService: VehicleService,
              private userService: UserService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.vehicle.sellerId) {
      this.userService.getUser(this.vehicle.sellerId).valueChanges().subscribe(userResp => {
        this.seller = userResp;
      });
    }
    if (this.vehicle.buyerId) {
      this.userService.getUser(this.vehicle.buyerId).valueChanges().subscribe(userResp => {
        this.buyer = userResp;
      });
    }
    this.vehicleService.getVehicleContent(this.vehicle.id, 'addInfo').valueChanges().subscribe(vehImportsResp => {
      this.vehicleAddInfo = !!vehImportsResp[0] ? vehImportsResp[0] : {};
    });
    this.userService.getUsers().valueChanges().subscribe(fbUsers => {
      this.users = fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.dateAdmission = new Date();
    this.departureDate = new Date();
    this.policeCheckDate = new Date();
    this.report13Date = new Date();
    this.patentReportdDate = new Date();
    this.VTVDate = new Date();
  }

  applyFilter(filterValue: string) {
    this.finding = filterValue != '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createVehicleAddInfo() {
    if (!this.vehicleAddInfo.id) {
      this.vehicleAddInfo.id = Date.now();
    } else {
      this.vehicleAddInfo.updateDate = Date.now();
    }

    this.vehicle.dateAdmission = this.dateAdmission.toISOString();
    this.vehicle.departureDate = this.departureDate.toISOString();
    this.vehicleAddInfo.report13Date = this.report13Date.toISOString();
    this.vehicleAddInfo.patentReportdDate = this.patentReportdDate.toISOString();
    this.vehicleAddInfo.policeCheckDate = this.policeCheckDate.toISOString();
    this.vehicleAddInfo.VTVDate = this.VTVDate.toISOString();
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id, this.vehicleAddInfo, 'addInfo'),
    ]).then(() => {
      this.vehicleService.createOrUpdateVehicle(this.vehicle).then( ()=> {
        this.snackbar.open('La informacion adicional para el vehivulo: ' + this.vehicle.id + ' a sido guardada con exito', 'Registro Guerdado', {
          duration: 5000
        });
      }).catch(err => {
        this.snackbar.open(err.toLocaleString(), 'Error', {
          duration: 5000
        });
      });
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  setSeller(isSeller) {
    this.isSeller = isSeller;
  }

  clearSellerOrBuyer() {
    this.saveSellerOrBuyer(null);
  }

  openDialogClearSellerOrBuyer(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Deseas eliminar el ${this.isSeller ? 'Vendedor' : 'Comprador'}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearSellerOrBuyer();
      }
    });
  }

  ISOStringToLocalDateString(iso) {
    const date = new Date(iso).toLocaleDateString();
    return date !== 'Invalid Date' ? date : '';
  }

  saveSellerOrBuyer(user) {
    if (this.isSeller) {
      this.vehicle.sellerId = user !== null ? user.id : null;
      this.seller = user;
    } else {
      this.vehicle.buyerId = user !== null ? user.id : null;
      this.buyer = user;
    }
    Promise.all([
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(() => {
      this.snackbar.open('La informacion adicional para el vehivulo: ' + this.vehicle.id + ' a sido guardada con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }
}
