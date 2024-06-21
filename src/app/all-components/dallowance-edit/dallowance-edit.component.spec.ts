import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DallowanceEditComponent } from './dallowance-edit.component';

describe('DallowanceEditComponent', () => {
  let component: DallowanceEditComponent;
  let fixture: ComponentFixture<DallowanceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DallowanceEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DallowanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
