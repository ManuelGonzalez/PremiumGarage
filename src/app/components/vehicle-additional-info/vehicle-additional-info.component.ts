import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {ProviderService} from '../../services/provider.service';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-vehicle-additional-info',
  templateUrl: './vehicle-additional-info.component.html',
  styleUrls: ['./vehicle-additional-info.component.css']
})
export class VehicleAdditionalInfoComponent implements OnInit {

  @Input() vehicle: any;

  constructor(private vehicleService: VehicleService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog){
  }

  ngOnInit() {
  }

}
