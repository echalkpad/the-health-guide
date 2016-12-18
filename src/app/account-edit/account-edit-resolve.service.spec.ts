/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountEditResolve } from './account-edit-resolve.service';

describe('Service: AccountEditResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountEditResolve]
    });
  });

  it('should ...', inject([AccountEditResolve], (service: AccountEditResolve) => {
    expect(service).toBeTruthy();
  }));
});
