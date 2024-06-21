import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionalEditComponent } from './concessional-edit.component';

describe('ConcessionalEditComponent', () => {
  let component: ConcessionalEditComponent;
  let fixture: ComponentFixture<ConcessionalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcessionalEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConcessionalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
