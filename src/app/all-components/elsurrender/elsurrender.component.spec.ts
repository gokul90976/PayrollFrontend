import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELsurrenderComponent } from './elsurrender.component';

describe('ELsurrenderComponent', () => {
  let component: ELsurrenderComponent;
  let fixture: ComponentFixture<ELsurrenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ELsurrenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ELsurrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
