import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as _ from 'lodash';

import { Food, Nutrient } from '../../models';
import { FoodService } from '../../providers';

@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  public food: Food;
  public foodNutrition: Array<Nutrient> = [];
  constructor(
    private _foodSvc: FoodService,
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this._foodSvc.getFoodReports$(this._navParams.get('id')).then((data: Food) => {
      this.food = data;
      this.foodNutrition = <Array<Nutrient>>_.values(this.food.nutrition);
    }).catch((err: Error) => {
        console.log(err);
        this._navCtrl.pop();
      })
  }

}
