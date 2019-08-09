import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.css']
})
export class SalesOrderReportComponent implements OnInit {

  @Input() vehicle: any;
  @ViewChild('report') report: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  public  donwloadPdf(){
    window.print()
  }

}
