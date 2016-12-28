import { Injectable } from '@angular/core';

import * as firebase from 'nativescript-plugin-firebase';

import { Food } from './food.model';

@Injectable()
export class FoodService {
    constructor() {
        firebase.keepInSync(
            '/food',
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

    public getFood(): Promise<Food[]> {
        return new Promise((resolve, reject) => {
            firebase.query(
                (res: firebase.FBData) => {
                    if (res.hasOwnProperty('error')) {
                        reject(res);
                    } else {
                        resolve(res.value);
                    }
                },
                'foods',
                {
                    singleEvent: true,
                    orderBy: {
                        type: firebase.QueryOrderByType.CHILD,
                        value: 'name'
                    }
                }
            );
        });

    }
}