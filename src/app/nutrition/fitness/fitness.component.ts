import { Component, OnInit } from '@angular/core';

import { Meal, MealTime, MealTracker } from './meal-tracker.model';

@Component({
  selector: 'app-fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.scss']
})
export class FitnessComponent implements OnInit {
  public currentDate: string = "";
  public mealTracker: MealTracker = new MealTracker();
  constructor() {
    let myDate = new Date(),
      currentDay = myDate.getDate(),
      currentMonth = myDate.getMonth() + 1,
      currentYear = myDate.getFullYear();
    this.currentDate = ((currentDay < 10) ? '0' + currentDay : currentDay) + '-' +
      ((currentMonth < 10) ? '0' + currentMonth : currentMonth) + '-' + currentYear;
  }

  ngOnInit(): void {

  }

}
