/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FoodDetailResolveService } from './food-detail-resolve.service';

describe('Service: FoodDetailResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodDetailResolveService]
    });
  });

  it('should ...', inject([FoodDetailResolveService], (service: FoodDetailResolveService) => {
    expect(service).toBeTruthy();
  }));
});
