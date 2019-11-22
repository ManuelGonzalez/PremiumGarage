import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseReportComponent } from './expertise-report.component';

describe('ExpertiseReportComponent', () => {
  let component: ExpertiseReportComponent;
  let fixture: ComponentFixture<ExpertiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpertiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
