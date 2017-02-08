/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FoodDetailsResolver } from './food-details-resolver.service';

describe('FoodDetailsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodDetailsResolver]
    });
  });

  it('should ...', inject([FoodDetailsResolver], (service: FoodDetailsResolver) => {
    expect(service).toBeTruthy();
  }));
});
