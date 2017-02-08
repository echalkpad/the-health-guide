// Angular
import { Injectable } from '@angular/core';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

// THG
import { Food, FoodService } from '../shared'

@Injectable()
export class FoodDetailsResolver implements Resolve<Food> {

  constructor(private _foodSvc: FoodService, private _router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Food> {
    let id: string = route.params['id'];
    return this._foodSvc.getFoodReports$(id).then((food: Food) => {
      console.log(food);
      return food;
    })
    .catch((err: Error) => {
      console.log(err);
      this._router.navigate(['/foods']);
    })
  }

}
