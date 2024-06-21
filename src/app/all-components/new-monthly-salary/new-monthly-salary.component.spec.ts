import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMonthlySalaryComponent } from './new-monthly-salary.component';

describe('NewMonthlySalaryComponent', () => {
  let component: NewMonthlySalaryComponent;
  let fixture: ComponentFixture<NewMonthlySalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMonthlySalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewMonthlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
