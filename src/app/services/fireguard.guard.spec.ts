import { TestBed } from '@angular/core/testing';

import { FireguardGuard } from './fireguard.guard';

describe('FireguardGuard', () => {
  let guard: FireguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FireguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
