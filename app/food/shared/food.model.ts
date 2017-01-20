import { Nutrition } from '../../shared';

export class Food extends Nutrition {
    constructor(
        public $key: string = '',
        public name: string = '',
        public category: string = '',
        public energy: number = 0,
        public quantity: number = 100
    ) {
        super();
        this.name = '';
    }
}