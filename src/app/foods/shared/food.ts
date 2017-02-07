import { Nutrition } from '../../shared';

export class Food {
    constructor(
        public name: string,
        public group: string,
        public nutrition: Nutrition = new Nutrition(),
        public quantity: number = 100,
        public unit: string = 'g'
    ) {}
}
