import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecoveryadditionsComponent } from './new-recoveryadditions.component';

describe('NewRecoveryadditionsComponent', () => {
  let component: NewRecoveryadditionsComponent;
  let fixture: ComponentFixture<NewRecoveryadditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewRecoveryadditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRecoveryadditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
