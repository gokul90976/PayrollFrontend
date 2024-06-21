import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcaListComponent } from './cca-list.component';

describe('CcaListComponent', () => {
  let component: CcaListComponent;
  let fixture: ComponentFixture<CcaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CcaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
