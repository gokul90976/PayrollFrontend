import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCalculationViewComponent } from './tax-calculation-view.component';

describe('TaxCalculationViewComponent', () => {
  let component: TaxCalculationViewComponent;
  let fixture: ComponentFixture<TaxCalculationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxCalculationViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxCalculationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
