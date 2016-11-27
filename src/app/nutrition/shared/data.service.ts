import { Injectable } from '@angular/core';

import { Food } from '../food/shared/food.model';
import { Nutrient } from '../nutrients/shared/nutrient.model';
import { Recipe } from '../recipes/shared/recipe.model';

@Injectable()
export class DataService {

  public storage: any;

  constructor() {
    this.storage = {
      auth: {},
      food: new Food(),
      nutrient: new Nutrient(),
      recipe: new Recipe()
    }
  }

}
