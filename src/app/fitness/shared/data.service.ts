import { Injectable } from '@angular/core';

import { ActivityTracker } from '../activity-track/activity-tracker.model';
import { Fitness } from '../fitness.model';
import { MealTracker } from '../meal-track/meal-tracker.model';
import { User } from '../../auth/user.model';

@Injectable()
export class DataService {
  constructor() { }

  public getActivityTrack(): ActivityTracker {
    return JSON.parse(sessionStorage.getItem('activity-track'));
  }

  public saveActivityTrack(at: ActivityTracker): void {
    sessionStorage.setItem('activity-track', JSON.stringify(Object.assign({}, at)));
  }

  public getCurrentDate(): string {
    if (!sessionStorage.getItem('date')) {
      let myDate = new Date(),
        currentDay = myDate.getDate(),
        currentMonth = myDate.getMonth() + 1,
        currentYear = myDate.getFullYear(),
        currentDate = currentYear + '/' + ((currentMonth < 10) ? '0' + currentMonth : currentMonth) + '/' + 
        ((currentDay < 10) ? '0' + currentDay : currentDay);

      sessionStorage.setItem('date', currentDate);
    }
    return sessionStorage.getItem('date');
  }

  public getEnergyConsumption(): number {
    return +sessionStorage.getItem('energy');
  }

  public saveEnergyConsumption(energy: number): void {
    sessionStorage.setItem('energy', energy.toString());
  }

  public getFitness(): Fitness {
    return JSON.parse(sessionStorage.getItem('fitness'));
  }

  public saveFitness(fit: Fitness): void {
    sessionStorage.setItem('fitness', JSON.stringify(Object.assign({}, fit)));
  }

  public getMealTrack(): MealTracker {
    return JSON.parse(sessionStorage.getItem('meal-track'));
  }

  public saveMealTrack(mt: MealTracker): void {
    sessionStorage.setItem('meal-track', JSON.stringify(Object.assign({}, mt)));
  }

  public getUser(): User {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  public saveUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(Object.assign({}, user)));
  }

}
