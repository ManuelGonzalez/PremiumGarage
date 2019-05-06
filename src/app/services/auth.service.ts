import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private cookieService: CookieService) {

    this.afAuth.authState.subscribe(res=>{
      if (res!=null)
        this.cookieService.set( 'user', res.email);
      else
        this.cookieService.delete('user');
    });
  }

  getAuthState(){
    return this.afAuth.authState;
  }

  login(event, email, password){
    event.preventDefault();
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.afAuth.user.subscribe(user=>{
        if(user.emailVerified){
          this.cookieService.set( 'user', res.user.email);
          this.snackbar.open('Bienvenido: '+res.user.email, 'Logged In', {
            duration: 3000
          });
        }else{
          this.logout();
          this.snackbar.open('Debes verificar tu email: '+res.user.email, 'Logged In', {
            duration: 3000
          });
        }
      });
    }).catch((error: any) => {
      if (error) {
        this.snackbar.open( error.toLocaleString(),'Error', {
          duration: 3000
        });
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(
      res => { // Success
        this.cookieService.delete('user');
        console.log('logout');
      },
      msg => { // Error
        console.log(msg);
      }
    );
  }

  get currentUserObservable(): any {
    return this.afAuth.auth
  }

  public get authenticated(): boolean {
    return this.afAuth.authState !== null;
  }

  createUserLogin(email:string,password:string,name:string){
    this.afAuth.auth.createUserWithEmailAndPassword(email,password).then(res=>{
      res.user.updateProfile({
        displayName: name
      });
      const config={
        url: 'https://premiumgarage-c0f80.firebaseapp.com/'
      };
      res.user.sendEmailVerification(config).then(res=>{
        this.snackbar.open( 'El usuario se ha creado con exito, verifique su correo para activar su cuenta.',
          'Error', {
          duration: 5000
        });
      }).catch((error: any) => {
        if (error) {
          this.snackbar.open( error.toLocaleString(),'Error', {
            duration: 3000
          });
        }
      });
    }).catch((error: any) => {
      if (error) {
        this.snackbar.open( error.toLocaleString(),'Error', {
          duration: 3000
        });
      }
    });
  }

}
