import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaArrearFieldsComponent } from './da-arrear-fields.component';

describe('DaArrearFieldsComponent', () => {
  let component: DaArrearFieldsComponent;
  let fixture: ComponentFixture<DaArrearFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaArrearFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaArrearFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
