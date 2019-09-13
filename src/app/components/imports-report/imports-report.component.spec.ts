import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportsReportComponent } from './imports-report.component';

describe('ImportsReportComponent', () => {
  let component: ImportsReportComponent;
  let fixture: ComponentFixture<ImportsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
