import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../shared/data.service';
import { ActivityTracker } from './activity-tracker.model';
import { ActivityTrackDataService } from './activity-track-data.service';

@Injectable()
export class ActivityTrackResolve implements Resolve<ActivityTracker> {

    constructor(private atDataSvc: ActivityTrackDataService, private dataSvc: DataService) { }

    public resolve(route: ActivatedRouteSnapshot): Promise<ActivityTracker> {
        return new Promise((resolve, reject) => {
            let savedAt: ActivityTracker | null = this.dataSvc.getActivityTrack();
            if (!savedAt || !savedAt.hasOwnProperty('date') ) {
                let activityTrack: ActivityTracker,
                    date: string = this.dataSvc.getCurrentDate();
                this.atDataSvc.getActivityTrack(date).subscribe((at: ActivityTracker) => {
                    if (!!at && !!at.hasOwnProperty('date')) {
                        activityTrack = at;
                        this.dataSvc.saveActivityTrack(activityTrack);
                        resolve(activityTrack);
                    }
                });
                setTimeout(() => {
                    if (!activityTrack) {
                        activityTrack = new ActivityTracker(date);
                        resolve(activityTrack);
                    }
                }, 3000);
            } else {
                resolve(this.dataSvc.getActivityTrack());
            }
        });
    }
}
