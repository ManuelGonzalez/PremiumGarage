import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-vehicle-additional-info',
  templateUrl: './vehicle-additional-info.component.html',
  styleUrls: ['./vehicle-additional-info.component.css']
})
export class VehicleAdditionalInfoComponent implements OnInit {

  @Input() vehicle: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  vehicleAddInfo: any = {};
  users: any[] = [];
  seller: any = {};
  buyer: any = {};
  finding: boolean = false;
  displayedColumns = ["id","name","actions"];
  isSeller: boolean = false;

  constructor(private vehicleService: VehicleService,
              private userService: UserService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
  }

  ngOnInit() {
    if(this.vehicle.sellerId){
      this.userService.getUser(this.vehicle.sellerId).valueChanges().subscribe(userResp=>{
        this.seller=userResp;
      })
    }
    if(this.vehicle.buyerId){
      this.userService.getUser(this.vehicle.buyerId).valueChanges().subscribe(userResp=>{
        this.buyer=userResp;
      })
    }
    this.vehicleService.getVehicleContent(this.vehicle.id,'addInfo').valueChanges().subscribe(vehImportsResp=>{
      this.vehicleAddInfo=!!vehImportsResp[0]?vehImportsResp[0]:{}
    });
    this.userService.getUsers().valueChanges().subscribe(fbUsers=>{
      this.users=fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    if(filterValue!=""){
      this.finding=true;
    }else{
      this.finding=false;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createVehicleAddInfo(){
    if(!this.vehicleAddInfo.id){
      this.vehicleAddInfo.id=Date.now();
    }else {
      this.vehicleAddInfo.updateDate=Date.now();
    }
    this.vehicleAddInfo.report13Date=this.vehicleAddInfo.report13Date?this.vehicleAddInfo.report13Date.toISOString():"";
    this.vehicleAddInfo.patentReportdDate=this.vehicleAddInfo.patentReportdDate?this.vehicleAddInfo.patentReportdDate.toISOString():"";
    this.vehicleAddInfo.policeCheckDate=this.vehicleAddInfo.policeCheckDate?this.vehicleAddInfo.policeCheckDate.toISOString():"";
    this.vehicleAddInfo.VTVDate=this.vehicleAddInfo.VTVDate?this.vehicleAddInfo.VTVDate.toISOString():"";
    Promise.all([
      this.vehicleService.createOrUpdateVehicleContent(this.vehicle.id,this.vehicleAddInfo,'addInfo'),
    ]).then(()=>{
        this.snackbar.open('La informacion adicional para el vehivulo: '+ this.vehicle.id + ' a sido guardada con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  setSeller(val){
    this.isSeller=val;
  }

  ISOStringToLocalDateString(iso){
    let date = new Date(iso).toLocaleDateString();
    return date!=="Invalid Date"?date:"";
  }

  saveSellerOrBuyer(user) {
    if(this.isSeller){
      this.vehicle.sellerId=user.id;
      this.seller=user;
    }else{
      this.vehicle.buyerId=user.id;
      this.buyer=user;
    }
    Promise.all([
      this.vehicleService.createOrUpdateVehicle(this.vehicle),
    ]).then(()=>{
      this.snackbar.open('La informacion adicional para el vehivulo: '+ this.vehicle.id + ' a sido guardada con exito', 'Registro Guerdado', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }
}
