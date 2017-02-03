// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Lodash
import * as _ from 'lodash';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Food } from './food.model';
import { HelperService, MAX_SAFE_INTEGER } from '../../shared'

@Injectable()
export class FoodService {
    private _foodObserver: Subscriber<Food>;
    constructor(private _helpSvc: HelperService) { }

    public getFoods(limit: number, searchQuery: string, withFetch?: boolean): Observable<Food> {
        limit = searchQuery !== '' ? MAX_SAFE_INTEGER : limit;

        return new Observable((observer: Subscriber<Food>) => {
            this._foodObserver = observer;
            firebase.query(
                (res: firebase.FBData) => {
                    if (res.hasOwnProperty('error')) {
                        this._foodObserver.error(res['error']);
                    } else if (this._helpSvc.isMatch(res.value, 'name', searchQuery)) {
                        let newFood: Food = _.assign({ $key: res.key, $type: res.type }, res.value);
                        this._foodObserver.next(newFood);
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
        });
    }

    public getNDBFoods(): any {
        // TODO: XHTTP Request from NDB Food Database API
    }

    public unsubscribeFoods(): void {
        if (!!this._foodObserver && !this._foodObserver.closed) {
            this._foodObserver.unsubscribe();
        }
    }
}