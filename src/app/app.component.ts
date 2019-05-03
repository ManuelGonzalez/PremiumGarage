import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MessagingService} from './services/messaging.service';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PremiumGarage';
  message: any={};
  logedin = false;
  loading = true;

  constructor(private swUpdate: SwUpdate, private messagingService: MessagingService, private auth: AuthService){
    this.messagingService.getPermission();
    this.messagingService.receiveMessage();
    this.message=this.messagingService.currentMessage;
    this.auth.afAuth.authState.subscribe(log=>{
      this.logedin=log!==null;
    });
    this.loading=false;
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
