import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from 'firebase';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  userLogin: any = {};
  currenUser: any = {};

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user=>{
      this.currenUser=user;
    })
  }

  ngOnInit() {
  }

  blankUser(){
    this.userLogin={};
  }

  createUserLogin(){
    this.authService.createUserLogin(this.userLogin.email,this.userLogin.password,this.userLogin.name);
    this.userLogin={};
  }

  updateUserLogin(name,email,password){
    this.authService.updateUser(name,email,password)
  }
}
