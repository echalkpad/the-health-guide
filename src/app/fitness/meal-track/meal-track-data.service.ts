import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { HelperService } from '../../shared/helper.service';
import { Meal, MealTime, MealTracker } from './meal-tracker.model';

@Injectable()
export class MealTrackDataService {
  private mealTrack: FirebaseObjectObservable<MealTracker>;
  constructor(private af: AngularFire, private helperSvc: HelperService) { }

  public getMealTrack(authId: string, date: string): FirebaseObjectObservable<MealTracker> {
    return this.af.database.object(`/meal-tracks/${authId}/${date}`);
  }

  public removeMealTrack(authId: string, date: string): void {
    this.getMealTrack(authId, date).remove();
  }

  public setMealTrack(authId: string, mealTrack: MealTracker): void {
    mealTrack.mealTimes.forEach((mt: MealTime) => this.helperSvc.removeHashkeys(mt.meals));
    console.log("Saving meal-track...", mealTrack);
    if (mealTrack.hasOwnProperty('$key')) {
      delete mealTrack['$key'];
      delete mealTrack['$exists'];
      this.getMealTrack(authId, mealTrack.date).update(mealTrack);
    } else {
      this.getMealTrack(authId, mealTrack.date).set(mealTrack);
    }
  }

}
