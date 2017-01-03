import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../../auth/auth.service';
import { HelperService } from '../../shared/helper.service';
import { Meal, MealTime, MealTracker } from './meal-tracker.model';

@Injectable()
export class MealTrackDataService {
  constructor(private af: AngularFire, private authSvc: AuthService, private helperSvc: HelperService) { }

  public getMealTrack(date: string): FirebaseObjectObservable<MealTracker> {
    return this.af.database.object(`/meal-tracks/${this.authSvc.getAuth().id}/${date}`);
  }

  public removeMealTrack(date: string): void {
    this.getMealTrack(date).remove();
  }

  public setMealTrack(mealTrack: MealTracker): void {
    mealTrack.mealTimes.forEach((mt: MealTime) => this.helperSvc.removeHashkeys(mt.meals));
    console.log("Saving meal-track...", mealTrack);
    if (mealTrack.hasOwnProperty('$key')) {
      delete mealTrack['$key'];
      delete mealTrack['$exists'];
      this.getMealTrack(mealTrack.date).update(mealTrack);
    } else {
      this.getMealTrack(mealTrack.date).set(mealTrack);
    }
  }

}
