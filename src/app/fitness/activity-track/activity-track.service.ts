import { Injectable } from '@angular/core';

import { Activity, ActivityTime, ActivityTracker, ActivityType } from './activity-tracker.model';

@Injectable()
export class ActivityTrackService {

  constructor() { }

  public searchActivityType(activityTypes: ActivityType[], name: string, label: string): null | ActivityType {
    let found: ActivityType;
    activityTypes.forEach((activityType: ActivityType) => {
      if (activityType.name === name && activityType.label === label) {
        found = activityType;
      }
    });
    return found;
  }

  public setActivityTimeTotal(at: ActivityTime): void {
    at.duration = 0;
    at.energyConsumption = 0;
    at.activities.forEach((act: ActivityType) => {
      at.duration += act.duration;
      at.energyConsumption += act.energyConsumption;
    });
  }

  public setActivityTrackTotal(activityTrack: ActivityTracker): void {
    activityTrack.duration = 0;
    activityTrack.energyConsumption = 0;
    activityTrack.activityTimes.forEach((at: ActivityTime) => {
      activityTrack.duration += at.duration;
      activityTrack.energyConsumption += at.energyConsumption;
    });
  }

}
