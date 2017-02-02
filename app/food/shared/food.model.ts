import { Nutrition } from '../../shared';

export class Food extends Nutrition {
    constructor(
        public name: string = '',
        public category: string = '',
        public energy: number = 0,
        public quantity: number = 100,
        public $key?: string,
        public $type?: string
    ) {
        super();
        this.name = '';
    }
}