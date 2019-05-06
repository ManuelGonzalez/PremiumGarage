
import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  MatButtonModule,
  MatIconModule,
  MatInputModule, MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { UserComponent } from './components/user/user.component';
import { InConstructionComponent } from './components/in-construction/in-construction.component';
import {MessagingService} from './services/messaging.service';
import {GeoService} from './services/geo.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import {CookieService} from 'ngx-cookie-service';

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
    children:[
      /*
      {
        path: ':name',
        component: UserComponent
      }
      */
    ]
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UserComponent,
    children:[
      /*
      {
        path: ':name',
        component: UserComponent
      }
      */
    ]
  },
  {
    path: 'in-construction',
    canActivate: [AuthGuard],
    component: InConstructionComponent,
    children:[
      /*
      {
        path: ':name',
        component: UserComponent
      }
      */
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
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
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [
    UserService,
    AuthService,
    GeoService,
    MessagingService,
    AuthGuard,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
