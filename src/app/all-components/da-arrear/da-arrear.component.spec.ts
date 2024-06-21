import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaArrearComponent } from './da-arrear.component';

describe('DaArrearComponent', () => {
  let component: DaArrearComponent;
  let fixture: ComponentFixture<DaArrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaArrearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaArrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
