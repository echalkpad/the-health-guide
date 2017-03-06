import { Nutrition } from './nutrition';

export class FoodGroup {
    constructor(
        public id: string,
        public name: string
    ) {}
}

export class Food {
    constructor(
        public ndbno: string,
        public name: string,
        public group: string,
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public unit: string = 'g'
    ) {}
}
