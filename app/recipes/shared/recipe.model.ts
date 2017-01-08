import { Chef } from './chef.model';
import { Food } from '../../food';
import { Nutrition } from '../../shared';

export interface Ingredient extends Food, Recipe { }

export class Recipe {
    constructor (
        public $key: string = '',
        public chef: Chef = new Chef(),
        public name: string = '',
        public description: string = '',
        public image: string = 'recipe.jpg',
        public category: string = '',
        public tags: string[] = [],
        public goodPoints: string[] = [],
        public badPoints: string[] = [],
        public ingredients: Ingredient[] = [],
        public duration: number = 1,
        public difficulty: string = 'Easy',
        public cookMethod: string = 'Raw',
        public cookTemperature: number = 0,
        public nutrition: Nutrition = new Nutrition(),
        public servings: number = 1,
        public instructions: string[] = [],
        public quantity: number = 0,
        public amount: number = 1,
        public shared: boolean = false
    ) {}
}