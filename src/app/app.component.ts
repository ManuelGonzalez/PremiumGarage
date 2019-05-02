import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MessagingService} from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PremiumGarage';
  message: any={};

  constructor(private swUpdate: SwUpdate, public messagingService: MessagingService){
    this.messagingService.getPermission();
    this.messagingService.receiveMessage();
    this.message=this.messagingService.currentMessage;
  }
  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((v) => {
        if (confirm('Actualización disponible, deseas obtenerla?')) {
          window.location.reload();
        }
      });
    }
  }
}
