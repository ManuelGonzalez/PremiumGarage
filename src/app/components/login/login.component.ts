import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  @ViewChild("email") mailField: ElementRef;

  constructor(public auth: AuthService) {
  }

  ngOnInit() {
  }

  login(event,email,password) {
    this.auth.login(event,email,password);
  }

  resetPassword(email) {
    this.auth.resetPassword(email)
  }


  logout() {
    this.auth.logout();
  }

}
