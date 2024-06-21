import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryadditionsComponent } from './recoveryadditions.component';

describe('RecoveryadditionsComponent', () => {
  let component: RecoveryadditionsComponent;
  let fixture: ComponentFixture<RecoveryadditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoveryadditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecoveryadditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
