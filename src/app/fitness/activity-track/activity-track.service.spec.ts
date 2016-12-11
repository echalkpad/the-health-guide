/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivityTrackService } from './activity-track.service';

describe('Service: ActivityTrack', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityTrackService]
    });
  });

  it('should ...', inject([ActivityTrackService], (service: ActivityTrackService) => {
    expect(service).toBeTruthy();
  }));
});
