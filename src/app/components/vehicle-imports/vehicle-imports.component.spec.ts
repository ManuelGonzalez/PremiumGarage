import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleImportsComponent } from './vehicle-imports.component';

describe('VehicleImportsComponent', () => {
  let component: VehicleImportsComponent;
  let fixture: ComponentFixture<VehicleImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleImportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
