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
    private _foodObserver: Subscriber<firebase.FBData>;
    constructor() { }

    public getFood(): Food {
        return this._food;
    }

    public getFoods(searchTerm: string): Observable<firebase.FBData> {
        return new Observable((observer: Subscriber<firebase.FBData>) => {
            this._foodObserver = observer;
            firebase.query(
                (res: firebase.FBData) => {
                    if (res.hasOwnProperty('error')) {
                        this._foodObserver.error(res['error']);
                    } else {
                        this._foodObserver.next(res);
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

    public unsubscribeFoods(): void {
        this._foodObserver.unsubscribe();
    }
}