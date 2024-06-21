import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEmpDetComponent } from './popup-emp-det.component';

describe('PopupEmpDetComponent', () => {
  let component: PopupEmpDetComponent;
  let fixture: ComponentFixture<PopupEmpDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupEmpDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupEmpDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
