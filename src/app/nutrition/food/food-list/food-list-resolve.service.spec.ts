/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FoodListResolveService } from './food-list-resolve.service';

describe('Service: FoodListResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodListResolveService]
    });
  });

  it('should ...', inject([FoodListResolveService], (service: FoodListResolveService) => {
    expect(service).toBeTruthy();
  }));
});
