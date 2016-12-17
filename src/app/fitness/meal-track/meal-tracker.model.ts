import { Food } from '../../nutrition/food/shared/food.model';
import { Recipe } from '../../nutrition/recipes/shared/recipe.model';
import { Nutrition } from '../../nutrition/shared/nutrition.model';

export interface Meal extends Food, Recipe { }

export class MealTrackNutrition extends Nutrition {
    constructor(
        public quantity: number = 0,
        public amount: number = 1
    ) {
        super();
    }
}

export class MealTime {
    constructor(
        public time: string = "",
        public meals: Meal[] = [],
        public nutrition: MealTrackNutrition = new MealTrackNutrition(),
        public tags: string[] = []
    ) { }
}

export class MealTracker {
    constructor(
        public date: string = "",
        public mealTimes: MealTime[] = [],
        public nutrition: MealTrackNutrition = new MealTrackNutrition(),
        public tags: string[] = []
    ) { }
}