import { TestBed } from '@angular/core/testing';

import { CheckConnectionService } from './check-connection.service';

describe('CheckConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckConnectionService = TestBed.get(CheckConnectionService);
    expect(service).toBeTruthy();
  });
});
