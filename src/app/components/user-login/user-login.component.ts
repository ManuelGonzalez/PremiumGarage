import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  userLogin: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  blankUser(){
    this.userLogin={};
  }

  createUserLogin(){

    this.authService.createUserLogin(this.userLogin.email,this.userLogin.password,this.userLogin.name);

  }
}
