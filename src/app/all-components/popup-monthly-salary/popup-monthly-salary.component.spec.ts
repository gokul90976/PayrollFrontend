import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMonthlySalaryComponent } from './popup-monthly-salary.component';

describe('PopupMonthlySalaryComponent', () => {
  let component: PopupMonthlySalaryComponent;
  let fixture: ComponentFixture<PopupMonthlySalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupMonthlySalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupMonthlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
