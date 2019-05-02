import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InConstructionComponent } from './in-construction.component';

describe('InConstructionComponent', () => {
  let component: InConstructionComponent;
  let fixture: ComponentFixture<InConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InConstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
