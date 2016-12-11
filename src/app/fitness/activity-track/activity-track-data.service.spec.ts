/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivityTrackDataService } from './activity-track-data.service';

describe('Service: ActivityTrackData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityTrackDataService]
    });
  });

  it('should ...', inject([ActivityTrackDataService], (service: ActivityTrackDataService) => {
    expect(service).toBeTruthy();
  }));
});
