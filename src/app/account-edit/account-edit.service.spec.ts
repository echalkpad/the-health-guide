/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountEditService } from './account-edit.service';

describe('Service: AccountEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountEditService]
    });
  });

  it('should ...', inject([AccountEditService], (service: AccountEditService) => {
    expect(service).toBeTruthy();
  }));
});
