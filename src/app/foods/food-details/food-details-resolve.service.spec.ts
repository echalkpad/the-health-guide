/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FoodDetailsResolveService } from './food-details-resolve.service';

describe('FoodDetailsResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodDetailsResolveService]
    });
  });

  it('should ...', inject([FoodDetailsResolveService], (service: FoodDetailsResolveService) => {
    expect(service).toBeTruthy();
  }));
});
