import { Food } from '../../food/shared/food.model';
import { Nutrition } from '../../nutrition.model';

export interface Ingredient extends Food, Recipe {
    amount: number;
}

export class Recipe {
    constructor (
        public name: string = "",
        public imgUrl: string = "",
        public category: string = "",
        public dietaries: string[] = [],
        public chef: string = "",
        public ingredients: Ingredient[] = [],
        public duration: number = 0,
        public difficulty: string = "",
        public cookMethod: string = "",
        public cookTemperature: number = 0,
        public nutrition: Nutrition = new Nutrition(),
        public servings: number = 1,
        public steps: string[] = [],
        public quantity: number = 0
    ) {}
}