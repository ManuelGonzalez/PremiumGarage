import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {GeoService} from '../../services/geo.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: any = {};
  cuilData: any ={};
  userData: any = [];
  users: any[]= [];
  provinces: any[]= [];
  selectedProvince: any={};
  locales: any[]= [];
  dataSource;
  isUpdate=false;
  displayedColumns: string[] = ['id', 'cuil', 'name', 'address', 'phone', 'email'];
  civilStatus: string[] = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public userService: UserService,
              public geoService: GeoService,
              private snackbar: MatSnackBar) {
    this.userService.getUsers().valueChanges().subscribe(fbUsers=>{
      this.users=fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.geoService.getProvinces().valueChanges().subscribe(fbProv=>{
      this.provinces=fbProv;
    })
  }


  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUser(){
    if (this.isUpdate){
      this.user.lastUpdate=Date.now();
    }else{
      this.user.creationDate=Date.now();
    }
    this.userService.createOrUpdateUser(this.user).then(res=>{
      this.snackbar.open('El usuario: '+ this.user.name + ' a sido guardado con exito', 'Save', {
        duration: 3000
      });
      this.user={};
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 3000
      });
    })
  }

  blankUser(){
    this.user={};
  }

  setLocales(){
    this.selectedProvince=this.provinces.find(p=>p.id==this.user.province);
    this.locales=this.selectedProvince.ciudades;
  }

  serarchUser(id) {
    this.userService.getUser(id).valueChanges().subscribe(fbUser=>{
      if(fbUser!==null){
        this.user=fbUser;
        this.isUpdate=true;
      }else{
        if(id){
          this.isUpdate=false;
          this.userService.getUserCuil(id).toPromise().then(cuilData=>{
            this.cuilData=cuilData;
            this.userService.getUserData(this.cuilData.data[0]).subscribe(resp=>{
              this.userData=resp;
              this.user.name=this.userData.Contribuyente.nombre;
              this.user.cuil=this.userData.Contribuyente.idPersona;
            })
          })
        }
      }
    });
  }
}
