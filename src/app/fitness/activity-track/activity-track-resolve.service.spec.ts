/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivityTrackResolve } from './activity-track-resolve.service';

describe('Service: ActivityTrackResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityTrackResolve]
    });
  });

  it('should ...', inject([ActivityTrackResolve], (service: ActivityTrackResolve) => {
    expect(service).toBeTruthy();
  }));
});
