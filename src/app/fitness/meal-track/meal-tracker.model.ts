import { Food } from '../../nutrition/food/shared/food.model';
import { Recipe } from '../../nutrition/recipes/shared/recipe.model';
import { Nutrition } from '../../nutrition/shared/nutrition.model';

export interface Meal extends Food, Recipe { }

export class MealTime {
    constructor(
        public time: string = "",
        public meals: Meal[] = [],
        public nutrition: Nutrition = new Nutrition()
    ) { }
}

export class MealTracker {
    constructor(
        public date: string = "",
        public mealTimes: MealTime[] = [],
        public nutrition: Nutrition = new Nutrition()
    ) { }
}