/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NutrientService } from './nutrient.service';

describe('Service: NutrientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NutrientService]
    });
  });

  it('should ...', inject([NutrientService], (service: NutrientService) => {
    expect(service).toBeTruthy();
  }));
});
