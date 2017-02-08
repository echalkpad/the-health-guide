import { Nutrition } from '../../shared';

export class FoodGroup {
    constructor(
        public id: string,
        public name: string
    ) {}
}

export class Food {
    constructor(
        public name: string,
        public group: string,
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public unit: string = 'g'
    ) {}
}
