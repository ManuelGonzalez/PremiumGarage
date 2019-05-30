import {Component, OnInit, ViewChild} from '@angular/core';
import {CardService} from '../../services/cards.service';
import {concat, Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {UserService} from '../../services/user.service';
import {ContactService} from '../../services/contact.service';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  user: any = {};
  userRef: any = {};
  contact: any = {};
  contacts: any[] = [];
  selectedBrand: any = {};
  brands: any[] = [];
  models: string[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  isUpdate=false;
  cuilData: any ={};
  userData: any ={};
  dataSource;
  displayedColumns: string[] = [];
  offers: string[] = ['Dinero', 'Auto', 'Ambos'];
  currentScreenWidth: string = '';
  flexMediaWatcher: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, private contactService: ContactService, private cardService: CardService, private snackbar: MatSnackBar, private mediaObserver: MediaObserver) {
    this.contactService.getContacts().valueChanges().subscribe(fbConts=>{
      this.contacts=fbConts;
      this.dataSource = new MatTableDataSource(this.contacts);
      this.dataSource = new MatTableDataSource(this.contacts);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.cardService.getBrands().valueChanges().subscribe(fbBrands=>{
      this.brands=fbBrands;
    });
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  setupTable() {
    switch (this.currentScreenWidth) {
      case 'xs':
        this.displayedColumns = ['id', 'name' ,'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      case 'sm':
        this.displayedColumns = ['id', 'name', 'offer' ,'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      case 'md':
        this.displayedColumns = ['id', 'name', 'offer', 'refName' ,'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
        break;
      default:
        this.displayedColumns = ['id', 'name', 'offer', 'refName' ,'actions'];
        this.displayedColumns.shift(); // remove 'internalId'
    }
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private _filter(value: string): string[] {
    if (value){
      const filterValue = value.toLowerCase();

      return this.models.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  setModels(){
    if(this.contact){
      this.contact.modelo="";
    }
    this.selectedBrand=this.brands.find(p=>p.id==this.contact.brand);
    this.models=this.selectedBrand.modelos;
  }

  createContact(){
    this.contact.id=this.user.id;
    this.contact.name=this.user.name;
    this.contact.refId=this.userRef.id;
    this.contact.refName=this.userRef.name;
    if (this.isUpdate){
      this.user.lastUpdate=Date.now();
      this.userRef.lastUpdate=Date.now();
    }else{
      this.user.creationDate=Date.now();
      this.userRef.creationDate=Date.now();
    }
    Promise.all([
      this.userService.createOrUpdateUser(this.user),
      this.userService.createOrUpdateUser(this.user),
      this.contactService.createOrUpdateContact(this.contact),
    ]).then(res=>{
      this.snackbar.open('El usuario: '+ this.user.name + ' a sido guardado con exito', 'Save', {
        duration: 5000
      });
      this.blankData();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });

  }

  setContact(contact){
    this.contact=contact;
  }

  blankData(){
    this.user={};
    this.userRef={};
    this.contact={};
  }

  serarchUser(id,user) {
    this.userService.getUser(id).valueChanges().subscribe(fbUser=>{
      if(fbUser!==null){
        if(user){
          this.user=fbUser;
          this.contactService.getContact(this.user.id).valueChanges().subscribe(fbCont=>{
            this.contact=fbCont;
            this.userService.getUser(this.contact.refId).valueChanges().subscribe(fbuserRef=>{
              this.userRef=fbuserRef;
            })
          })
        }else{
          this.userRef=fbUser;
        }
        this.isUpdate=true;
      }else{
        if(id){
          this.isUpdate=false;
          this.userService.getUserCuil(id).toPromise().then(cuilData=>{
            this.cuilData=cuilData;
            this.userService.getUserData(this.cuilData.data[0]).subscribe(resp=>{
              this.userData=resp;
              if (user){
                this.user.name=this.userData.Contribuyente.nombre;
                this.user.cuil=this.userData.Contribuyente.idPersona;
              } else {
                this.userRef.name=this.userData.Contribuyente.nombre;
                this.userRef.cuil=this.userData.Contribuyente.idPersona;
              }
            })
          })
        }
      }
    });
  }

  deleteContact(){
    this.contactService.deleteContact(this.contact).then(()=>{
      this.snackbar.open('El contacto: '+ this.contact.name + ' a sido eliminado', 'Delete', {
        duration: 5000
      });
      this.blankData();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

}
