import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionalTableComponent } from './concessional-table.component';

describe('ConcessionalTableComponent', () => {
  let component: ConcessionalTableComponent;
  let fixture: ComponentFixture<ConcessionalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcessionalTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConcessionalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
