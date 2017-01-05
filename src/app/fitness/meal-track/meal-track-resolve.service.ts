import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../shared/data.service';
import { MealTracker } from './meal-tracker.model';
import { MealTrackDataService } from './meal-track-data.service';

@Injectable()
export class MealTrackResolve implements Resolve<MealTracker> {

    constructor(private _dataSvc: DataService, private _mtDataSvc: MealTrackDataService) { }

    public resolve(route: ActivatedRouteSnapshot): Promise<MealTracker> {
        return new Promise((resolve, reject) => {
            let savedMt: MealTracker | null = this._dataSvc.getMealTrack();
            if (!savedMt || !savedMt.hasOwnProperty('date')) {
                let mealTrack: MealTracker,
                    date: string = this._dataSvc.getCurrentDate();
                this._mtDataSvc.getMealTrack(date).subscribe((mt: MealTracker) => {
                    if (!!mt && !!mt.hasOwnProperty('date')) {
                        mealTrack = mt;
                        this._dataSvc.saveMealTrack(mealTrack);
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
