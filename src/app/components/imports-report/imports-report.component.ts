import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NumeralPipe} from 'ngx-numeral';

@Component({
  selector: 'app-imports-report',
  templateUrl: './imports-report.component.html',
  styleUrls: ['./imports-report.component.css']
})
export class ImportsReportComponent implements OnInit {

  @Input() vehicle: any;
  @Input() vehicleImports: any[];
  @ViewChild('reportImport') report: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  public  donwloadPdf() {
    window.print();
  }

  getImports(importType) {
    return this.vehicleImports.filter(vi => vi.importType === importType);
  }

  sumImports(importType) {
    const total = this.vehicleImports.filter(vi => vi.importType === importType).map(imp => new NumeralPipe(imp.import)).reduce((nrImportA, nrImportB) => nrImportA.add(nrImportB.value()), new NumeralPipe(0));
    return total.value();
  }

}
