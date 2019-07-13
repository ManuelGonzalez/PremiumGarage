import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProviderService} from '../../services/provider.service';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css']
})
export class ProviderDetailComponent implements OnInit {

  id: any = null;
  provider: any = null;

  constructor(private route:ActivatedRoute, private providerService: ProviderService) {
    this.id = this.route.snapshot.params['id'];
    this.providerService.getProvider(this.id).valueChanges().subscribe(provResp=>{
      this.provider=provResp;
    });
  }

  ngOnInit() {
  }

}
