/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MealTrackResolve } from './meal-track-resolve.service';

describe('Service: MealTrackResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealTrackResolve]
    });
  });

  it('should ...', inject([MealTrackResolve], (service: MealTrackResolve) => {
    expect(service).toBeTruthy();
  }));
});
