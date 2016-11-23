/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NutrientDetailResolve } from './nutrient-detail-resolve.service';

describe('Service: NutrientDetailResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NutrientDetailResolve]
    });
  });

  it('should ...', inject([NutrientDetailResolve], (service: NutrientDetailResolve) => {
    expect(service).toBeTruthy();
  }));
});
