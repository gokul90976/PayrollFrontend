import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearFieldsComponent } from './arrear-fields.component';

describe('ArrearFieldsComponent', () => {
  let component: ArrearFieldsComponent;
  let fixture: ComponentFixture<ArrearFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrearFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrearFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
