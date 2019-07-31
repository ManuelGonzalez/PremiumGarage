
import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*firebase*/
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {UserService} from './services/user.service';
import {MenuComponent} from './components/menu/menu.component';
import {FooterComponent} from './components/footer/footer.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import {
  DateAdapter,
  MatAutocompleteModule,
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule, MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {UserComponent} from './components/user/user.component';
import { InConstructionComponent } from './components/in-construction/in-construction.component';
import {MessagingService} from './services/messaging.service';
import {GeoService} from './services/geo.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import {CookieService} from 'ngx-cookie-service';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { ContactComponent } from './components/contact/contact.component';
import {CardService} from './services/cards.service';
import {ContactService} from './services/contact.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import {VehicleService} from './services/vehicle.service';
import {SafePipe} from './pipes/safe.pipe';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import {DateFormat} from './Class/date-format';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import { ProvidersComponent } from './components/providers/providers.component';
import { ProviderDetailComponent } from './components/provider-detail/provider-detail.component';
import {NumeralModule} from 'ngx-numeral';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { VehicleAdditionalInfoComponent } from './components/vehicle-additional-info/vehicle-additional-info.component';

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDUq4SZwj8eaLkUJ-_qKDGw6PiV3ryOOw4",
    authDomain: "premiumgarage-c0f80.firebaseapp.com",
    databaseURL: "https://premiumgarage-c0f80.firebaseio.com",
    projectId: "premiumgarage-c0f80",
    storageBucket: "premiumgarage-c0f80.appspot.com",
    messagingSenderId: "224048404997"
  }
};

const appRoutes:Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children:[]
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UserComponent,
    children:[]
  },
  {
    path: 'vehicles',
    canActivate: [AuthGuard],
    component: VehicleComponent,
    children:[]
  },
  {
    path: 'vehicles/:id',
    canActivate: [AuthGuard],
    component: VehicleDetailComponent,
    children:[]
  },
  {
    path: 'providers',
    canActivate: [AuthGuard],
    component: ProvidersComponent,
    children:[]
  },
  {
    path: 'providers/:id',
    canActivate: [AuthGuard],
    component: ProviderDetailComponent,
    children:[]
  },
  {
    path: 'contacts',
    canActivate: [AuthGuard],
    component: ContactComponent,
    children:[]
  },
  {
    path: 'user-login',
    canActivate: [AuthGuard],
    component: UserLoginComponent,
    children:[]
  },
  {
    path: 'in-construction',
    canActivate: [AuthGuard],
    component: InConstructionComponent,
    children:[]
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    UserComponent,
    InConstructionComponent,
    LoadingSpinnerComponent,
    UserLoginComponent,
    ContactComponent,
    VehicleComponent,
    SafePipe,
    ConfirmationDialogComponent,
    VehicleDetailComponent,
    ProvidersComponent,
    ProviderDetailComponent,
    VehicleAdditionalInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    RouterModule.forRoot(appRoutes),
    NumeralModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatCheckboxModule,
    GooglePlaceModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [
    UserService,
    AuthService,
    VehicleService,
    CardService,
    ContactService,
    GeoService,
    MessagingService,
    AuthGuard,
    CookieService,
    { provide: DateAdapter, useClass: DateFormat },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter:DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
