// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Food } from './food.model';

@Injectable()
export class FoodService {
    private _food: Food;
    private _foods: Food[];
    private _foodObserver: Subscriber<Food>;
    constructor() { }

    public getFood(): Food {
        return this._food;
    }

    public getFoods(withFetch?: boolean): Promise<Food[]> {
        return new Promise((resolve, reject) => {
            if (!withFetch && !!this._foods && !!this._foods.length) {
                resolve(this._foods);
            } else {
                this.keepOnSyncFoods();
                this._foods = [];
                firebase.query(
                    (res: firebase.FBData) => {
                        if (res.hasOwnProperty('error')) {
                            reject(res['error']);
                        } else {
                            this._foods = [...res.value];
                            resolve(res.value);
                        }
                    },
                    '/foods',
                    {
                        singleEvent: true,
                        orderBy: {
                            type: firebase.QueryOrderByType.CHILD,
                            value: 'name'
                        }
                    }
                );
            }
        });
    }

    public keepOnSyncFoods(): void {
        firebase.keepInSync('/foods', true).then(
            function () {
                console.log("firebase.keepInSync is ON for foods");
            },
            function (error) {
                console.log("firebase.keepInSync error: " + error);
            }
        );
    }

    public storeFood(food: Food): void {
        this._food = food;
    }
}