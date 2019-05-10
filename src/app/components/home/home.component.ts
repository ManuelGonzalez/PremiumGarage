import { Component, OnInit } from '@angular/core';
import {ContactService} from '../../services/contact.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  contacts: any[];

  constructor(private contactService: ContactService) {
    this.contactService.getContacts().valueChanges().subscribe(fbConts=>{
      this.contacts=fbConts;
    });
  }

  ngOnInit() {
  }

}
