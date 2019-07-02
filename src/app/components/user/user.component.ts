import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {GeoService} from '../../services/geo.service';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subscription} from 'rxjs';
import {Upload} from '../../models/upload';
import * as _ from 'lodash';
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
  displayedColumns: string[] = [];
  civilStatus: string[] = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];
  nationalityStatus: string[] = ['Argentino Nativo', 'Naturalizado', 'Extranjero'];
  nativeDoc: string[] = ['D.N.I.'];
  foreineDoc: string[] = ['D.N.I.', 'PASAP'];
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
    switch (this.currentScreenWidth) {
      case 'xs':
        this.displayedColumns = ['cuil','id', 'name', 'actions'];
        this.displayedColumns.shift();
        break;
      case 'sm':
        this.displayedColumns = ['cuil','id', 'name', 'email', 'actions'];
        this.displayedColumns.shift();
        break;
      case 'md':
        this.displayedColumns = ['cuil','id', 'name', 'movilPhone', 'email', 'actions'];
        this.displayedColumns.shift();
        break;
      default:
        this.displayedColumns = ['cuil','id', 'name', 'movilPhone', 'email', 'actions'];
        this.displayedColumns.shift();
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
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    }).finally(()=>{
      this.blanckInputfiles();
    });
  }

  blankUser(){
    this.user={};
    this.blanckInputfiles();
  }

  blanckInputfiles(){
    this.myInputVariable.nativeElement.value = "";
    this.numberFiles = 0;
    let that = this;
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

  setLocales(province){
    this.selectedProvince=this.provinces.find(p=>p.id==province);
    this.locales=this.selectedProvince.localidades;
  }

  deleteUser(){
    Promise.all([
      this.userService.deleteUser(this.user),
      this.userService.deleteAllUserFile(this.user.id)
    ]).then(resp=>{
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
    if(this.selectedFiles){
      this.loadFiles=true;
      let files = this.selectedFiles;
      let filesIndex = _.range(files.length);
      _.each(filesIndex, (idx) => {
        this.currentUpload = new Upload(files[idx]);
        this.userService.pushUserFiles(this.currentUpload,id)}
      )
    }
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

