import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Food } from '../food.model';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {
  public foodList: FirebaseListObservable<Food[]>;
  constructor(private foodSvc: FoodService) { }

  ngOnInit(): void {
    this.foodList = this.foodSvc.getFood();
  }

}
