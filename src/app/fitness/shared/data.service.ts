import { Injectable } from '@angular/core';

import { MealTracker } from '../meal-track/meal-tracker.model';

@Injectable()
export class DataService {
  constructor() { }

  public getCurrentDate(): string {
    if (!sessionStorage.getItem('date')) {
      let myDate = new Date(),
        currentDay = myDate.getDate(),
        currentMonth = myDate.getMonth() + 1,
        currentYear = myDate.getFullYear(),
        currentDate = ((currentDay < 10) ? '0' + currentDay : currentDay) + '/' +
          ((currentMonth < 10) ? '0' + currentMonth : currentMonth) + '/' + currentYear;
          
      sessionStorage.setItem('date', currentDate);
    }
    return sessionStorage.getItem('date');
  }

  public getMealTrack(): MealTracker {
    return JSON.parse(sessionStorage.getItem('meal-track'));
  }

  public saveMealTrack(mt: MealTracker): void {
    sessionStorage.setItem('meal-track', JSON.stringify(Object.assign({}, mt)));
  }

}
