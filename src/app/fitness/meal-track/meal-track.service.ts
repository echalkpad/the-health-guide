import { Injectable } from '@angular/core';

import { Meal, MealTime, MealTracker, MealTrackNutrition } from './meal-tracker.model';
import { Nutrition } from '../../nutrition/shared/nutrition.model';

@Injectable()
export class MealTrackService {

  constructor() { }

  public filterMeals(ingredients: Meal[], searchTerm: string = ''): Meal[] {
    return ingredients.filter((ingredient: Meal) => ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  }

  public getMealTimeNutrition(mealTime: MealTime): MealTrackNutrition {
    let mtNutrition: MealTrackNutrition = new MealTrackNutrition();
    if (mealTime.meals.length > 0) {
      mealTime.meals.forEach((meal: Meal )=> {
        if (meal.hasOwnProperty('nutrition')) {
          // The meal is a recipe
          mtNutrition.quantity = Math.floor(mtNutrition.quantity + meal.amount * meal.quantity);
          for (let nutrientCategory in meal.nutrition) {
            let nutrients = meal.nutrition[nutrientCategory];
            if (typeof nutrients === 'number') {
              mtNutrition[nutrientCategory] = Math.floor(mtNutrition[nutrientCategory] + nutrients * meal.amount);
            } else if (typeof nutrients === 'object') {
              for (let nutrient in nutrients) {
                mtNutrition[nutrientCategory][nutrient] = Math.floor(
                  mtNutrition[nutrientCategory][nutrient] + nutrients[nutrient] * meal.amount
                  );
              }
            }
          }
        } else {
          // The meal is a basic food
          mtNutrition.quantity = Math.floor(mtNutrition.quantity + meal.quantity);
          for (let nutrientCategory in meal) {
            let nutrients = meal[nutrientCategory];
            if (typeof nutrients === 'number' && nutrientCategory !== 'quantity') {
              mtNutrition[nutrientCategory] = Math.floor(
                mtNutrition[nutrientCategory] + nutrients * (meal.quantity / 100)
                );
            } else if (typeof nutrients === 'object') {
              for (let nutrient in nutrients) {
                mtNutrition[nutrientCategory][nutrient] = Math.floor(
                  mtNutrition[nutrientCategory][nutrient] + nutrients[nutrient] * (meal.quantity / 100)
                );
              }
            }
          }
        }
      });
    }

    return mtNutrition;
  }

}
