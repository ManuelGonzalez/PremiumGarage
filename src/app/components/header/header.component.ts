import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  promptEvent = null;

  constructor() { }

  ngOnInit() {
    $('#sidebarToggle').on('click', (e) => {
      e.preventDefault();
      $('body').toggleClass('sidebar-toggled');
      $('.sidebar').toggleClass('toggled');
    });
    this.prepareInstall();
  }

  prepareInstall() {
    window.addEventListener('beforeinstallprompt', e => {
      this.promptEvent = e;
      const button = document.getElementById('installButton');
      button.addEventListener('click', () => {
        this.promptEvent.prompt();
      });
    });
  }

}
