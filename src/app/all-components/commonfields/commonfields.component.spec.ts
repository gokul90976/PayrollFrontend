import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonfieldsComponent } from './commonfields.component';

describe('CommonfieldsComponent', () => {
  let component: CommonfieldsComponent;
  let fixture: ComponentFixture<CommonfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonfieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
