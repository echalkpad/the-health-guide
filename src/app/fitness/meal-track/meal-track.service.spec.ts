/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MealTrackService } from './meal-track.service';

describe('Service: MealTrack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealTrackService]
    });
  });

  it('should ...', inject([MealTrackService], (service: MealTrackService) => {
    expect(service).toBeTruthy();
  }));
});
