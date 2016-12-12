import { Injectable } from '@angular/core';

import { Activity, ActivityType } from './activity-tracker.model';

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

}
