import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {GeoService} from '../../services/geo.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subscription} from 'rxjs';
import {Upload} from '../../models/upload';
import * as _ from 'lodash';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: any = {};
  file: any = {};
  cuilData: any ={};
  userData: any = [];
  users: any[]= [];
  files: any[]= [];
  provinces: any[]= [];
  selectedProvince: any={};
  locales: any[]= [];
  dataSource;
  isUpdate=false;
  displayedColumns: string[] = ['id', 'cuil', 'name', 'address', 'phone', 'email','actions'];
  civilStatus: string[] = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];
  currentScreenWidth: string = '';
  flexMediaWatcher: Subscription;
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;
  loadFiles=false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myInput') myInputVariable: ElementRef;

  constructor(private userService: UserService,
              private geoService: GeoService,
              private snackbar: MatSnackBar,
              private mediaObserver: MediaObserver,
              private sanitizer: DomSanitizer,
              public dialog: MatDialog) {
    this.userService.getUsers().valueChanges().subscribe(fbUsers=>{
      this.users=fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.geoService.getProvinces().valueChanges().subscribe(fbProv=>{
      this.provinces=fbProv;
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

  setupTable() {
    if (this.currentScreenWidth === 'xs') { // only display internalId on larger screens
      this.displayedColumns = ['id', 'name','actions'];
      this.displayedColumns.shift(); // remove 'internalId'
    }
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUser(){
    if (this.isUpdate){
      this.user.lastUpdate=Date.now();
    }else{
      this.user.creationDate=Date.now();
    }
    Promise.all([
      this.uploadMulti(this.user.id),
      this.userService.createOrUpdateUser(this.user),
    ]).then(res=>{
      this.snackbar.open('El usuario: '+ this.user.name + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
      this.blankUser()
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    })
  }

  blankUser(){
    this.user={};
    this.myInputVariable.nativeElement.value = "";
    this.numberFiles = 0;
    var that = this;
    setTimeout(function(this){
      that.loadFiles = false;
    },5000);
  }

  setUser(user){
    this.user=user;
    this.userService.getUserFiles(user.id).subscribe(files=>{
      this.files=files
    })
  }

  setFile(file){
    this.file=file;
  }

  setLocales(){
    this.selectedProvince=this.provinces.find(p=>p.id==this.user.province);
    this.locales=this.selectedProvince.ciudades;
  }

  deleteUser(){
    this.userService.deleteUser(this.user).then(resp=>{
      this.snackbar.open('El usuario: '+ this.user.name + ' a sido eliminado', 'Delete', {
        duration: 5000
      });
      this.blankUser();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

  deleteFile(){
    this.userService.deleteUserFile(this.user.id, this.file).then(resp=>{
      this.snackbar.open('El archivo: a sido eliminado', 'Delete', {
        duration: 5000
      });
      this.blankUser();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
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
      this.userService.pushUserFiles(this.currentUpload,id)}
    )
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

  openDialogDeleteUser(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Deseas eliminar el al usuario: ${this.user.name}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteUser();
      }
    });
  }

}

