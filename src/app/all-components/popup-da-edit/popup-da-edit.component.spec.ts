import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDaEditComponent } from './popup-da-edit.component';

describe('PopupDaEditComponent', () => {
  let component: PopupDaEditComponent;
  let fixture: ComponentFixture<PopupDaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupDaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupDaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
