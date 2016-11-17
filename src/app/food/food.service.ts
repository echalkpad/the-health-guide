import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';

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

    public getFood(key: string): FirebaseObjectObservable<Food> {
        return this.af.database.object('/food/`${key}`');
    }

    public getFoods(): Promise<Food[]> {
        return new Promise((resolve, reject) => {
            let foundFood: boolean = false;
            this.foods.subscribe(
                (data: Food[]) => {
                    if (!!data && !!data.length) {
                        foundFood = true;
                        resolve(data);
                    }
                }, (error: Error) => reject(error),
                () => {
                    if (!foundFood) {
                        reject("Not found");
                    }
                }
            );
        });
    }
}