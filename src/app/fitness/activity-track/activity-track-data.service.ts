import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { HelperService } from '../../shared/helper.service';
import { Activity, ActivityTime, ActivityTracker } from './activity-tracker.model';

@Injectable()
export class ActivityTrackDataService {
  private activities: FirebaseListObservable<Activity[]>;
  private activityTrack: FirebaseObjectObservable<ActivityTracker>;
  constructor(private af: AngularFire, private helperSvc: HelperService) {
    this.activities = af.database.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getActivities(): FirebaseListObservable<Activity[]> {
    return this.activities;
  }

  public getActivityTrack(authId: string, date: string): FirebaseObjectObservable<ActivityTracker> {
    return this.af.database.object(`/activity-tracks/${authId}/${date}`);
  }

  public removeActivityTrack(authId: string, date: string): void {
    this.getActivityTrack(authId, date).remove();
  }

  public setActivityTrack(authId: string, activityTrack: ActivityTracker): void {
    activityTrack.activityTimes.forEach((at: ActivityTime) => this.helperSvc.removeHashkeys(at.activities));
    console.log(activityTrack);
    if (activityTrack.hasOwnProperty('$key')) {
      delete activityTrack['$key'];
      this.getActivityTrack(authId, activityTrack.date).update(activityTrack);
    } else {
      this.getActivityTrack(authId, activityTrack.date).set(activityTrack);
    }
  }

}
