import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraEditComponent } from './hra-edit.component';

describe('HraEditComponent', () => {
  let component: HraEditComponent;
  let fixture: ComponentFixture<HraEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HraEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HraEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
