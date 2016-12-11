import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Auth } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../shared/data.service';
import { ActivityTracker } from './activity-tracker.model';
import { ActivityTrackDataService } from './activity-track-data.service';

@Injectable()
export class ActivityTrackResolve implements Resolve<ActivityTracker> {

    constructor(private atDataSvc: ActivityTrackDataService, private authSvc: AuthService, private dataSvc: DataService) { }

    public resolve(route: ActivatedRouteSnapshot): Promise<ActivityTracker> {
        return new Promise((resolve, reject) => {
            if (!this.dataSvc.getActivityTrack()) {
                let activityTrack: ActivityTracker,
                    date: string = this.dataSvc.getCurrentDate();
                this.atDataSvc.getActivityTrack(this.authSvc.getAuthData().id, date).subscribe((at: ActivityTracker) => {
                    if (!!at && !!at.date) {
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
