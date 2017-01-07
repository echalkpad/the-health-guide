// Angular
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Food } from './food.model';

@Injectable()
export class FoodService {
    private _food: Food;
    private _foodObserver: Subscriber<Food>;
    constructor() { }

    public getFood(): Food {
        return this._food;
    }

    public getFoods(count: number, searchTerm: string): Observable<Food> {
        return new Observable((observer: Subscriber<Food>) => {
            this._foodObserver = observer;
            firebase.query(
                (res: firebase.FBData) => {
                    if (res.hasOwnProperty('error')) {
                        this._foodObserver.error(res['error']);
                    } else {
                        for (let recipeKey in res.value) {
                            this._foodObserver.next(res.value[recipeKey])
                        }
                    }
                },
                '/foods',
                {
                    // Do not know how to handle duplicate items
                    singleEvent: true,
                    orderBy: {
                        type: firebase.QueryOrderByType.CHILD,
                        value: 'name'
                    },
                    range: {
                        type: firebase.QueryRangeType.EQUAL_TO,
                        value: searchTerm
                    },
                    limit: {
                        type: firebase.QueryLimitType.FIRST,
                        value: count
                    }
                }
            );
        });
    }

    public keepOnSyncFoods(): void {
        firebase.keepInSync(
            '/foods',
            true
        ).then(
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

    public unsubscribeFoods(): void {
        this._foodObserver.unsubscribe();
    }
}