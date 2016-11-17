import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Food } from '../food.model';
import { FoodService } from '../food.service';

@Injectable()
export class FoodListResolveService implements Resolve<Food[]> {

    constructor(private foodSvc: FoodService, private router: Router) { }

    public resolve(): Promise<Food[]> | boolean {
        return this.foodSvc.getFoods().then(
            (data: Food[]) => {
                if (!!data && !!data.length) {
                    return data;
                } else {
                    this.router.navigate(['/home']);
                    return false;
                }
            },
            (error: Error) => {
                console.log(error);
                this.router.navigate(['/home']);
                return false;
            }
        );
    }

}
