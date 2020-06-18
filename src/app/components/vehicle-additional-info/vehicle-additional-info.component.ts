import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {UserService} from '../../services/user.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ProviderService} from '../../services/provider.service';

@Component({
  selector: 'app-vehicle-additional-info',
  templateUrl: './vehicle-additional-info.component.html',
  styleUrls: ['./vehicle-additional-info.component.css']
})
export class VehicleAdditionalInfoComponent implements OnInit {

  @Input() vehicle: any;
  @Input() isReport: boolean;
  @ViewChild(MatSort) sortProvider: MatSort;
  @ViewChild(MatPaginator) paginatorProvider: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  dataSourceProvider;
  vehicleAddInfo: any = null;
  users: any[] = [];
  providers: any[] = [];
  seller: any = {};
  buyer: any = {};
  finding = false;
  findingProvider = false;
  displayedColumns = ['id', 'name', 'actions'];
  isSeller = false;
  dateAdmission: any = {};
  departureDate: any = {};
  policeCheckDate: any = {};
  report13Date: any = {};
  patentReportdDate: any = {};
  VTVDate: any = {};
  civilStatus: string[] = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];

  constructor(private vehicleService: VehicleService,
              private userService: UserService,
              private providerService: ProviderService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.vehicle.sellerId) {
      if (this.vehicle.sellerIsProvider) {
        this.providerService.getProvider(this.vehicle.sellerId).valueChanges().subscribe(providerResp => {
          this.seller = providerResp;
        });
      } else {
        this.userService.getUser(this.vehicle.sellerId).valueChanges().subscribe(userResp => {
          this.seller = userResp;
        });
      }
    }
    if (this.vehicle.buyerId) {
      if (this.vehicle.buyerIsProvider) {
        this.providerService.getProvider(this.vehicle.buyerId).valueChanges().subscribe(providerResp => {
          this.buyer = providerResp;
        });
      } else {
        this.userService.getUser(this.vehicle.sellerId).valueChanges().subscribe(userResp => {
          this.buyer = userResp;
        });
      }
    }
    this.vehicleService.getVehicleContent(this.vehicle.id, 'addInfo').valueChanges().subscribe(vehImportsResp => {
      this.vehicleAddInfo = !!vehImportsResp[0] ? vehImportsResp[0] : {};
      this.policeCheckDate = this.vehicleAddInfo.policeCheckDate ? new Date(this.vehicleAddInfo.policeCheckDate) : null;
      this.report13Date = this.vehicleAddInfo.report13Date ? new Date(this.vehicleAddInfo.report13Date) : null;
      this.patentReportdDate = this.vehicleAddInfo.patentReportdDate ? new Date(this.vehicleAddInfo.patentReportdDate) : null;
      this.VTVDate = this.vehicleAddInfo.VTVDate ? new Date(this.vehicleAddInfo.VTVDate) : null;
    });
    this.userService.getUsers().valueChanges().subscribe(fbUsers => {
      this.users = fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.providerService.getProviders().valueChanges().subscribe(fbProviders => {
      this.providers = fbProviders;
      this.dataSourceProvider = new MatTableDataSource(this.providers);
      this.dataSourceProvider.sort = this.sortProvider;
      this.dataSourceProvider.paginator = this.paginatorProvider;
    });
    this.dateAdmission = this.vehicle.dateAdmission ? new Date(this.vehicle.dateAdmission) : null;
    this.departureDate = this.vehicle.departureDate ? new Date(this.vehicle.departureDate) : null;
  }

  applyFilter(filterValue: string) {
    this.finding = filterValue !== '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterProvider(filterValue: string) {
    this.findingProvider = filterValue !== '';
    this.dataSourceProvider.filter = filterValue.trim().toLowerCase();
  }

  createVehicleAddInfo() {
    if (!this.vehicleAddInfo.id) {
      this.vehicleAddInfo.id = Date.now();
    } else {
      this.vehicleAddInfo.updateDate = Date.now();
    }
    this.vehicle.dateAdmission = this.dateAdmission ? this.dateAdmission.toISOString() : null;
    this.vehicle.departureDate = this.departureDate ? this.departureDate.toISOString() : null;
    this.vehicleAddInfo.report13Date = this.report13Date ? this.report13Date.toISOString() : null;
    this.vehicleAddInfo.patentReportdDate = this.patentReportdDate ? this.patentReportdDate.toISOString() : null;
    this.vehicleAddInfo.policeCheckDate = this.policeCheckDate ? this.policeCheckDate.toISOString() : null;
    this.vehicleAddInfo.VTVDate = this.VTVDate ? this.VTVDate.toISOString() : null;
    Promise.all([
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(() => {
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id, this.vehicleAddInfo, 'addInfo').then( () => {
        this.snackbar.open('La información adicional para el vehivulo: ' + this.vehicle.id + ' a sido guardada con exito', 'Registro Guardado', {
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
    this.saveSellerOrBuyer(null, false);
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

  saveSellerOrBuyer(user, isProvider) {
    if (this.isSeller) {
      this.vehicle.sellerId = user !== null ? user.id : null;
      this.seller = user;
      this.vehicle.sellerIsProvider = isProvider;
    } else {
      this.vehicle.buyerId = user !== null ? user.id : null;
      this.buyer = user;
      this.vehicle.buyerIsProvider = isProvider;
    }
    Promise.all([
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(() => {
      this.snackbar.open('La información adicional para el vehivulo: ' + this.vehicle.id + ' a sido guardada con exito', 'Registro Guardado', {
        duration: 5000
      });
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }
}
