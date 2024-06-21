import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraListComponent } from './hra-list.component';

describe('HraListComponent', () => {
  let component: HraListComponent;
  let fixture: ComponentFixture<HraListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HraListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
