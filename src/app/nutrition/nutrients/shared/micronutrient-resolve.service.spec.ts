/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MicronutrientResolveService } from './micronutrient-resolve.service';

describe('Service: MicronutrientResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicronutrientResolveService]
    });
  });

  it('should ...', inject([MicronutrientResolveService], (service: MicronutrientResolveService) => {
    expect(service).toBeTruthy();
  }));
});
