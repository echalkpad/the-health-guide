import { Injectable } from '@angular/core';

import { Food } from '../food/shared/food.model';
import { Nutrient } from '../nutrients/shared/nutrient.model';
import { Recipe } from '../recipes/shared/recipe.model';

@Injectable()
export class DataService {
  constructor() { }

  public getFood(): Food {
    return JSON.parse(sessionStorage.getItem('food'));
  }

  public saveFood(food: Food): void {
    sessionStorage.setItem('food', JSON.stringify(Object.assign({}, food)));
  }

  public getNutrient(): Nutrient {
    return JSON.parse(sessionStorage.getItem('nutrient'));
  }

  public saveNutrient(nutrient: Nutrient): void {
    sessionStorage.setItem('nutrient', JSON.stringify(Object.assign({}, nutrient)));
  }

  public getRecipe(): Recipe {
    return JSON.parse(sessionStorage.getItem('recipe'));
  }

  public saveRecipe(recipe: Recipe): void {
    sessionStorage.setItem('recipe', JSON.stringify(Object.assign({}, recipe)));
  }

}
