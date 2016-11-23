import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Food } from '../shared/food.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {
  public aminoacids: string[] = [];
  public basicNutrients: string[] = [];
  public minerals: string[] =  [];
  public food: Food;
  public vitamins: string[] = [];
  constructor(private detector: ChangeDetectorRef, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { food: Food }) => {
      if (!!data) {
        this.food = Object.assign({}, data.food);
        for (let prop in this.food) {
          if (typeof this.food[prop] === 'number') {
            this.basicNutrients.push(prop);
          }
        }
        for (let prop in this.food['amino acids']) {
          this.aminoacids.push(prop);
        }
        for (let prop in this.food['vitamins']) {
          this.vitamins.push(prop);
        }
        for (let prop in this.food['minerals']) {
          this.minerals.push(prop);
        }
        this.detector.markForCheck();
        console.log(this.food);
      }
    });
  }

}
