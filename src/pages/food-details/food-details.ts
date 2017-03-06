import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Food } from '../../models';
import { FoodService } from '../../providers';

@Component({
  selector: 'page-food-details',
  templateUrl: 'food-details.html'
})
export class FoodDetailsPage {
  public food: Food;
  constructor(
    private _foodSvc: FoodService,
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this._foodSvc.getFoodReports$(this._navParams.get('id')).then((data: Food) => this.food = data)
      .catch((err: Error) => {
        console.log(err);
        this._navCtrl.pop();
      })
  }

}
