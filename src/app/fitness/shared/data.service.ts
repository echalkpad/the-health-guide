import { Injectable } from '@angular/core';

import { Fitness } from '../fitness.model';
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

}
