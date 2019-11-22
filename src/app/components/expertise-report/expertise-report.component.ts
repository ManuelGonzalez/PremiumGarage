import {Component, Input, OnInit} from '@angular/core';
import {VehicleService} from '../../services/vehicle.service';
import {ExpertiseService} from '../../services/expertise.service';
import {UserService} from '../../services/user.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-expertise-report',
  templateUrl: './expertise-report.component.html',
  styleUrls: ['./expertise-report.component.css']
})
export class ExpertiseReportComponent implements OnInit {

  @Input() vehicle: any;
  vehicleExpertise: any = {};
  expertises: any[] = [];
  expertisesType: string[] = ['Carrocería', 'Interior de vehículo', 'Mecánica'];

  constructor(private vehicleService: VehicleService,
              private experticeServise: ExpertiseService,
              private userService: UserService,
              private utilService: UtilService) { }

  ngOnInit() {
    this.experticeServise.getExpertises().valueChanges().subscribe(expertisesResp => {
      this.expertises = expertisesResp;
    });
    this.vehicleService.getVehicleContent(this.vehicle.id, 'expertise').valueChanges().subscribe(expertiseResp=>{
      this.vehicleExpertise = !!expertiseResp[0] ? expertiseResp[0] : {};
    });
  }

  public  donwloadPdf() {
    window.print();
  }

}
