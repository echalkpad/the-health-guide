import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Food } from '../shared/food.model';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {
  public food: Food;
  constructor(private detector: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { food: Food }) => {
      if (!!data) {
        this.food = Object.assign({}, data.food);
        console.log(this.food);
      }
    });
  }

}
