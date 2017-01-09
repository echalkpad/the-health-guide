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

    public getFoods(withFetch?: boolean): Observable<Food> {
        if (!!this._foodObserver && !this._foodObserver.closed) {
            this._foodObserver.unsubscribe();
        }
        return new Observable((observer: Subscriber<Food>) => {
            this._foodObserver = observer;
            if (!withFetch && !!this._foods && !!this._foods.length) {
                this._foods.forEach((item: Food) => this._foodObserver.next(item));
            } else {
                this.keepOnSyncFoods();
                this._foods = [];
                firebase.query(
                    (res: firebase.FBData) => {
                        if (res.hasOwnProperty('error')) {
                            this._foodObserver.error(res['error']);
                        } else if (res.type === 'ChildAdded') {
                            this._foods.push(res.value);
                            this._foodObserver.next(res.value);
                        }
                    },
                    '/foods',
                    {
                        singleEvent: false,
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