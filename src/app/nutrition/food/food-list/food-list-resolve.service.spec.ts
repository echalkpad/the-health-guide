/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FoodListResolve } from './food-list-resolve.service';

describe('Service: FoodListResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodListResolve]
    });
  });

  it('should ...', inject([FoodListResolve], (service: FoodListResolve) => {
    expect(service).toBeTruthy();
  }));
});
