import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Meal, MealTime, MealTracker } from './meal-tracker.model';

@Injectable()
export class MealTrackDataService {
  private mealTrack: FirebaseObjectObservable<MealTracker>;
  constructor(private af: AngularFire) { }

  public getMealTrack(authId: string, date: string): FirebaseObjectObservable<MealTracker> {
    return this.af.database.object(`/meal-tracks/${authId}/${date}`);
  }

  public removeMealTrack(authId: string, date: string): void {
    this.getMealTrack(authId, date).remove();
  }

  public setMealTrack(authId: string, mealTrack: MealTracker): void {
    this.getMealTrack(authId, mealTrack.date).update(mealTrack);
  }

}
