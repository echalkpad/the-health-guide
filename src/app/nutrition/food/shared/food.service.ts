import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Food } from './food.model';

@Injectable()
export class FoodService {
    private foods: FirebaseListObservable<Food[]>;
    constructor(private af: AngularFire) {
        this.foods = af.database.list('/foods', {
            query: {
                orderByChild: 'name'
            }
        });
    }

    public getFood(key: string | number): FirebaseObjectObservable<Food> {
        return this.af.database.object(`/foods/${key}`);
    }

    public getFoods(): FirebaseListObservable<Food[]> {
        return this.foods;
    }
}