import { Food } from '../../food/shared/food.model';
import { Nutrition } from '../../shared/nutrition.model';

export interface Ingredient extends Food, Recipe {
    amount: number;
}

export class Recipe {
    constructor (
        public chef: any = {
            name: "",
            avatar: "",
            authId: ""
        },
        public $key: string = "0",
        public name: string = "",
        public image: string = "",
        public category: string = "",
        public tags: string[] = [],
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