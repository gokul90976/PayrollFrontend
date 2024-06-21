import { TestBed } from '@angular/core/testing';

import { NumberingService } from './numbering.service';

describe('NumberingService', () => {
  let service: NumberingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
