import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Auth } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../shared/data.service';
import { MealTracker } from './meal-tracker.model';
import { MealTrackDataService } from './meal-track-data.service';

@Injectable()
export class MealTrackResolve implements Resolve<MealTracker> {

    constructor(private authSvc: AuthService, private dataSvc: DataService, private mtDataSvc: MealTrackDataService) { }

    public resolve(route: ActivatedRouteSnapshot): Promise<MealTracker> {
        return new Promise((resolve, reject) => {
            let savedMt: MealTracker | null = this.dataSvc.getMealTrack();
            if (!savedMt || !savedMt.hasOwnProperty('date')) {
                let mealTrack: MealTracker,
                    date: string = this.dataSvc.getCurrentDate();
                this.mtDataSvc.getMealTrack(this.authSvc.getAuth().id, date).subscribe((mt: MealTracker) => {
                    if (!!mt && !!mt.hasOwnProperty('date')) {
                        mealTrack = mt;
                        this.dataSvc.saveMealTrack(mealTrack);
                        resolve(mealTrack);
                    }
                });
                setTimeout(() => {
                    if (!mealTrack) {
                        mealTrack = new MealTracker(date);
                        resolve(mealTrack);
                    }
                }, 3000);
            } else {
                resolve(savedMt);
            }
        });
    }
}
