/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FitnessProfileResolve } from './fitness-profile-resolve.service';

describe('Service: FitnessProfileResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FitnessProfileResolve]
    });
  });

  it('should ...', inject([FitnessProfileResolve], (service: FitnessProfileResolve) => {
    expect(service).toBeTruthy();
  }));
});
