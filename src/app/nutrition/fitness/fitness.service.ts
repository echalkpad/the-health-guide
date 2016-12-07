import { Injectable } from '@angular/core';

import { Meal } from './meal-tracker.model';

@Injectable()
export class FitnessService {

  constructor() { }

  public filterMeals(ingredients: Meal[], searchTerm: string = ''): Meal[] {
    return ingredients.filter((ingredient: Meal) => ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  }

}
