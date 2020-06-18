import {Component, OnInit, ViewChild} from '@angular/core';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {ProviderService} from '../../services/provider.service';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isUpdate: boolean = false;
  provider: any = {};
  providers: any[] = [];
  providersType: any[]= [];
  address: any = {};
  isNewAddress: boolean=false;
  dataSource;
  flexMediaWatcher: Subscription;
  currentScreenWidth: string = '';
  displayedColumns: string[] = [];
  providersTypeControl = new FormControl();
  filteredOptions: Observable<string[]>;
  finding: boolean = false;

  constructor(private providerService: ProviderService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog,
              private mediaObserver: MediaObserver) {
    this.providerService.getProviders().valueChanges().subscribe(fbProviders=>{
      this.providers=fbProviders;
      this.dataSource = new MatTableDataSource(this.providers);
      this.dataSource = new MatTableDataSource(this.providers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.providerService.getRubros().valueChanges().subscribe(rubResp=>{
      this.providersType=rubResp;
    });
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    });
    this.filteredOptions = this.providersTypeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }

  ngOnInit() {
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.providersType.filter(option => option.toLowerCase().includes(filterValue));
  }

  setupTable() {
    switch (this.currentScreenWidth) {
      case 'xs':
        this.displayedColumns = ['type', 'name', 'description'];
        this.displayedColumns.shift();
        break;
      case 'sm':
        this.displayedColumns = ['type', 'name', 'description', 'phone', 'actions'];
        this.displayedColumns.shift();
        break;
      case 'md':
        this.displayedColumns = ['type', 'name', 'description', 'phone', 'email', 'actions'];
        this.displayedColumns.shift();
        break;
      default:
        this.displayedColumns = ['type', 'name', 'description', 'phone', 'email', 'inCharge', 'actions'];
        this.displayedColumns.shift();
    }
  };

  blankProvider(){
    this.provider={};
  }

  public handleAddressChange(address: Address) {
    this.address.id=address.id;
    this.address.name=address.name;
    this.address.url=address.url;
    this.address.address_components=address.address_components;
    this.isNewAddress=true;
  }

  applyFilter(filterValue: string) {
    if (filterValue!=""){
      this.finding=true;
    }else{
      this.finding=false;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createProvider(){
    if (this.isUpdate){
      this.provider.lastUpdate=Date.now();
    }else{
      this.provider.id=Date.now();
    }
    if(this.isNewAddress){
      this.provider.address=this.address;
    }
    this.providerService.createOrUpdateProvider(this.provider).then(res=>{
      this.snackbar.open('El proveedor: '+ this.provider.name + ' a sido guardado con exito', 'Registro Guardado', {
        duration: 5000
      });
      this.blankProvider();
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });

  }

  setProvider(provider){
    this.isUpdate=true;
    this.provider=provider;
  }

  openDialogDeleteProvider(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Deseas eliminar el proveedor: ${this.provider.name}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteProvider();
      }
    });
  }

  deleteProvider(){
    this.providerService.deleteProvider(this.provider.id).then(resp=>{
      this.snackbar.open('El proveedor: a sido eliminado', 'Delete', {
        duration: 5000
      });
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

}
