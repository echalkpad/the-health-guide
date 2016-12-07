/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FitnessDataService } from './fitness-data.service';

describe('Service: FitnessData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FitnessDataService]
    });
  });

  it('should ...', inject([FitnessDataService], (service: FitnessDataService) => {
    expect(service).toBeTruthy();
  }));
});
