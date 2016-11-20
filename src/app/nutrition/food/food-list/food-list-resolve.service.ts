import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Injectable()
export class FoodListResolveService implements Resolve<Food[]> {
    private foods: Food[] = [];
    constructor(private foodSvc: FoodService, private router: Router) { }

    public resolve(): Promise<Food[]> | boolean {
        return new Promise((resolve, reject) => {
            this.foodSvc.getFoods().subscribe(
                (data: Food[]) => {
                    if (!!data && !!data.length) {
                        this.foods = [...data];
                    }
                }, (error: Error) => {
                    reject(error);
                    this.router.navigate(['/nutrition']);
                }
            );
            setTimeout(() => {
                if (!this.foods) {
                    this.router.navigate(['/nutrition']);
                } else {
                    resolve(this.foods);
                }
            }, 5000);
        });
    }

}
