import { TestBed } from '@angular/core/testing';

import { PnplService } from './pnpl.service';

describe('PnplService', () => {
  let service: PnplService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnplService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
