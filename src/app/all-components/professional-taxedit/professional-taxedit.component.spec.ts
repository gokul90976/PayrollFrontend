import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTaxeditComponent } from './professional-taxedit.component';

describe('ProfessionalTaxeditComponent', () => {
  let component: ProfessionalTaxeditComponent;
  let fixture: ComponentFixture<ProfessionalTaxeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessionalTaxeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionalTaxeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
