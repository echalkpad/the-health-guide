import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Food } from './food.model';

@Injectable()
export class FoodService {
    private food: FirebaseListObservable<Food[]>;
    constructor(private af: AngularFire) {
        this.food = af.database.list('/food', {
            query: {
                orderByChild: 'name'
            }
        });
    }

    public getFood(): FirebaseListObservable<Food[]> {
        return this.food;
    }
}