import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncometaxEditComponent } from './incometax-edit.component';

describe('IncometaxEditComponent', () => {
  let component: IncometaxEditComponent;
  let fixture: ComponentFixture<IncometaxEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncometaxEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncometaxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
