import { TestBed } from '@angular/core/testing';

import { CheckNamesService } from './check-names.service';

describe('CheckNamesService', () => {
  let service: CheckNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
