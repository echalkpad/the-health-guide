import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html'
})
export class FoodListPage {

  constructor(private _navCtrl: NavController, private _navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodListPage');
  }

}
