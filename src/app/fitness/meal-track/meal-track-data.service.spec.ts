/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MealTrackDataService } from './meal-track-data.service';

describe('Service: MealTrackData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealTrackDataService]
    });
  });

  it('should ...', inject([MealTrackDataService], (service: MealTrackDataService) => {
    expect(service).toBeTruthy();
  }));
});
