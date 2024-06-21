import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementarySalaryComponent } from './supplementary-salary.component';

describe('SupplementarySalaryComponent', () => {
  let component: SupplementarySalaryComponent;
  let fixture: ComponentFixture<SupplementarySalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplementarySalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplementarySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
