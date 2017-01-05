import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Food } from './food.model';

@Injectable()
export class FoodService {
    private _foods: FirebaseListObservable<Food[]>;
    constructor(private _af: AngularFire) {
        this._foods = _af.database.list('/foods', {
            query: {
                orderByChild: 'name'
            }
        });
    }

    public getFood(key: string | number): FirebaseObjectObservable<Food> {
        return this._af.database.object(`/foods/${key}`);
    }

    public getFoods(): FirebaseListObservable<Food[]> {
        return this._foods;
    }
}