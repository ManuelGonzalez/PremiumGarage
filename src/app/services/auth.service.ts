import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userObs: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    private snackbar: MatSnackBar) {

    this.userObs = afAuth.authState;

  }

  login(event, email, password){
    event.preventDefault();
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.snackbar.open('Bienvenido: '+res.user.email, 'Logged In', {
        duration: 3000
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

}
