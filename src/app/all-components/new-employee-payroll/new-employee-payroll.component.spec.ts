import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeePayrollComponent } from './new-employee-payroll.component';

describe('NewEmployeePayrollComponent', () => {
  let component: NewEmployeePayrollComponent;
  let fixture: ComponentFixture<NewEmployeePayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEmployeePayrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEmployeePayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
