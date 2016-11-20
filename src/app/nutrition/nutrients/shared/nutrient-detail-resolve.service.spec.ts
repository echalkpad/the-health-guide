/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NutrientDetailResolveService } from './nutrient-detail-resolve.service';

describe('Service: NutrientDetailResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NutrientDetailResolveService]
    });
  });

  it('should ...', inject([NutrientDetailResolveService], (service: NutrientDetailResolveService) => {
    expect(service).toBeTruthy();
  }));
});
