import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCalculationsComponent } from './tax-calculations.component';

describe('TaxCalculationsComponent', () => {
  let component: TaxCalculationsComponent;
  let fixture: ComponentFixture<TaxCalculationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxCalculationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
