// Angular
import { Injectable } from '@angular/core';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Food } from './food.model';

@Injectable()
export class FoodService {
    private food: Food;
    constructor() {
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

    public getFood(): Food {
        return this.food;
    }

    public getFoods(): Promise<Food[]> {
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

    public storeFood(food: Food): void {
        this.food = food;
    }
}