import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DallowanceComponent } from './dallowance.component';

describe('DallowanceComponent', () => {
  let component: DallowanceComponent;
  let fixture: ComponentFixture<DallowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DallowanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DallowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
