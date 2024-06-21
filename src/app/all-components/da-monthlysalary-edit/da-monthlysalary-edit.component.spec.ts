import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaMonthlysalaryEditComponent } from './da-monthlysalary-edit.component';

describe('DaMonthlysalaryEditComponent', () => {
  let component: DaMonthlysalaryEditComponent;
  let fixture: ComponentFixture<DaMonthlysalaryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaMonthlysalaryEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DaMonthlysalaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
