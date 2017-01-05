import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../../auth/auth.service';
import { HelperService } from '../../shared/helper.service';
import { Activity, ActivityTime, ActivityTracker } from './activity-tracker.model';

@Injectable()
export class ActivityTrackDataService {
  private _activities: FirebaseListObservable<Activity[]>;
  constructor(private _af: AngularFire, private _authSvc: AuthService, private _helperSvc: HelperService) {
    this._activities = _af.database.list('/activities', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getActivities(): FirebaseListObservable<Activity[]> {
    return this._activities;
  }

  public getActivityTrack(date: string): FirebaseObjectObservable<ActivityTracker> {
    return this._af.database.object(`/activity-tracks/${this._authSvc.getAuth().id}/${date}`);
  }

  public removeActivityTrack(date: string): void {
    this.getActivityTrack(date).remove();
  }

  public setActivityTrack(activityTrack: ActivityTracker): void {
    activityTrack.activityTimes.forEach((at: ActivityTime) => this._helperSvc.removeHashkeys(at.activities));
    console.log("Saving activity-track...", activityTrack);
    if (activityTrack.hasOwnProperty('$key')) {
      delete activityTrack['$key'];
      this.getActivityTrack(activityTrack.date).update(activityTrack);
    } else {
      this.getActivityTrack(activityTrack.date).set(activityTrack);
    }
  }

}
