import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {User} from 'firebase';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private cookieService: CookieService) {

    this.afAuth.authState.subscribe(res => {
      if (res != null) {
        this.cookieService.set( 'user', res.email);
      } else {
        this.cookieService.delete('user');
      }
    });
    this.user = this.afAuth.user;
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  login(event, email, password) {
    event.preventDefault();
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.afAuth.user.toPromise().then(user => {
        if (user !== null && user.emailVerified) {
          this.cookieService.set( 'user', res.user.email);
          this.snackbar.open('Bienvenido: ' + res.user.email, 'Logged In', {
            duration: 5000
          });
        } else {
          this.logout();
          this.snackbar.open('Debes verificar tu email: ' + res.user.email, 'Logged In', {
            duration: 5000
          });
        }
      });
    }).catch((error: any) => {
      if (error) {
        this.snackbar.open( error.toLocaleString(), 'Error', {
          duration: 5000
        });
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(
      res => { // Success
        this.cookieService.delete('user');
        this.snackbar.open('Hasta Luego.', 'Logout', {
          duration: 5000
        });
      },
      msg => { // Error
        console.log(msg);
      }
    );
  }

  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        this.snackbar.open('Se ha enviado un mail para restablecer la contraseña: ' + email, 'Reset password', {
          duration: 5000
        });
      })
      .catch((error) => {
        this.snackbar.open( error.toLocaleString(), 'Error', {
          duration: 5000
        });
      });
  }

  get currentUserObservable(): any {
    return this.afAuth.auth;
  }

  public get authenticated(): boolean {
    return this.afAuth.authState !== null;
  }

  createUserLogin(email: string, password: string, name: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
      res.user.updateProfile({
        displayName: name
      });
      const config = {
        url: 'https://premiumgarage-c0f80.firebaseapp.com/'
      };
      res.user.sendEmailVerification(config).then(res => {
        this.snackbar.open( 'El usuario se ha creado con exito, verifique su correo para activar su cuenta.',
          'Error', {
          duration: 5000
        });
      }).catch((error: any) => {
        if (error) {
          this.snackbar.open( error.toLocaleString(), 'Error', {
            duration: 5000
          });
        }
      });
    }).catch((error: any) => {
      if (error) {
        this.snackbar.open( error.toLocaleString(), 'Error', {
          duration: 5000
        });
      }
    });
  }

  updateUser(name, email, password) {
    Promise.all([
      this.afAuth.auth.currentUser.updateProfile({
        displayName: name
      }),
      this.afAuth.auth.currentUser.updateEmail(email),
      this.afAuth.auth.currentUser.updatePassword(password)
    ]).then(() => {
      this.snackbar.open( 'El usuario se ha actualizado con exito.',
        'Update', {
          duration: 5000
        });
    }).catch((error: any) => {
      if (error) {
        this.snackbar.open( error.toLocaleString(), 'Error', {
          duration: 5000
        });
      }
    });
  }

}
