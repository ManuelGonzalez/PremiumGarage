import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: any = {};
  users: any[]= [];
  dataSource;
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'address', 'phone', 'email'];

  constructor(public userService: UserService,
              private snackbar: MatSnackBar) {
    this.userService.getUsers().valueChanges().subscribe(fbUsers=>{
      this.users=fbUsers;
      this.dataSource = new MatTableDataSource(this.users);
      console.log(this.users);
      console.log(this.dataSource);
    });
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUser(){
    this.userService.createOrUpdateUser(this.user).then(res=>{
      this.snackbar.open('El usuario: '+this.user.first_name + ' ' + this.user.last_name + ' a sido guardado con exito', 'Save', {
        duration: 3000
      });
      this.user={};
    }).catch(err=>{
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 3000
      });
    })
  }

}
