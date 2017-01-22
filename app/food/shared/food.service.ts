// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Lodash
import * as _ from 'lodash';

// Nativescript
import * as connectivity from 'connectivity';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Food } from './food.model';
import { HelperService, MAX_SAFE_INTEGER } from '../../shared'

@Injectable()
export class FoodService {
    private _foods: Food[] = [];
    private _foodObserver: Subscriber<Food>;
    constructor(private _helpSvc: HelperService) { }

    public getFoods(limit: number, searchTerm: string, withFetch?: boolean): Observable<Food> {
        let connectionType = connectivity.getConnectionType();
        limit = searchTerm !== '' ? MAX_SAFE_INTEGER : limit;

        return new Observable((observer: Subscriber<Food>) => {
            this._foodObserver = observer;
            if (!withFetch && this._foods.length >= limit) {
                this._foods.forEach((item: Food, idx: number) => {
                    if (idx < limit) {
                        this._foodObserver.next(item);
                    }
                });
            } else {
                this._foods = [];
                firebase.query(
                    (res: firebase.FBData) => {
                        if (res.hasOwnProperty('error')) {
                            this._foodObserver.error(res['error']);
                        } else if (res.type === 'ChildAdded' && this._helpSvc.isMatch(res.value, 'name', searchTerm)) {
                            let newFood: Food = _.assign({ $key: res.key }, res.value);
                            this._foods.push(newFood);
                            this._foodObserver.next(newFood);
                        } else if (this._foods.length === limit) {
                            this._foodObserver.complete();
                        }
                    },
                    '/foods',
                    {
                        singleEvent: false,
                        orderBy: {
                            type: firebase.QueryOrderByType.CHILD,
                            value: 'name'
                        },
                        limit: {
                            type: firebase.QueryLimitType.FIRST,
                            value: limit
                        }
                    }
                );
            }
        });
    }

    public keepOnSyncFoods(): void {
        firebase.keepInSync('/foods', true).then(
            function () {
                console.log('firebase.keepInSync is ON for foods');
            },
            function (error) {
                console.log('firebase.keepInSync error: ' + error);
            }
        );
    }

    public unsubscribeFoods(): void {
        if (!!this._foodObserver && !this._foodObserver.closed) {
            this._foodObserver.unsubscribe();
        }
    }
}