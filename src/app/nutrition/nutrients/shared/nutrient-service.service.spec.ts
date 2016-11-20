/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NutrientServiceService } from './nutrient-service.service';

describe('Service: NutrientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NutrientServiceService]
    });
  });

  it('should ...', inject([NutrientServiceService], (service: NutrientServiceService) => {
    expect(service).toBeTruthy();
  }));
});
