// Angular
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// THG
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Injectable()
export class FoodDetailResolve implements Resolve<Food> {
  constructor(private _foodSvc: FoodService) { }

  public resolve(): Promise<Food> {
    return new Promise((resolve, reject) => {
      resolve(this._foodSvc.getFood());
    });
  }

}
