import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcaEditComponent } from './cca-edit.component';

describe('CcaEditComponent', () => {
  let component: CcaEditComponent;
  let fixture: ComponentFixture<CcaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CcaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
