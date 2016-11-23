import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Injectable()
export class FoodListResolve implements Resolve<Food[]> {
    private foods: Food[] = [];
    constructor(private foodSvc: FoodService, private router: Router) { }

    public resolve(): Promise<Food[]> | boolean {
        return new Promise((resolve, reject) => {
            this.foodSvc.getFoods().subscribe(
                (data: Food[]) => {
                    if (!!data && !!data.length) {
                        this.foods = [...data];
                        console.log(this.foods);
                    }
                }, (error: Error) => {
                    reject(error);
                    this.router.navigate(['/nutrition']);
                }
            );
            setTimeout(() => {
                if (this.foods.length === 0) {
                    this.router.navigate(['/nutrition']);
                } else {
                    resolve(this.foods);
                }
            }, 5000);
        });
    }

}
