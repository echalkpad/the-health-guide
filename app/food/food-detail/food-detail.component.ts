import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { Food } from '../shared/food.model';

@Component({
  moduleId: module.id,
  selector: 'thg-food-detail',
  templateUrl: 'food-detail.component.html',
  styleUrls: ['food-detail.component.css']
})
export class FoodDetailComponent implements OnInit {
  public aminoacids: string[] = [];
  public basicNutrients: string[] = [];
  public minerals: string[] = [];
  public food: Food;
  public vitamins: string[] = [];
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: RouterExtensions
  ) { }

  public goBack(): void {
    this.router.back();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { food: Food }) => {
      this.food = data.food;
      this.aminoacids = Object.keys(this.food['amino acids']);
      this.vitamins = Object.keys(this.food['vitamins']);
      this.minerals = Object.keys(this.food['minerals']);
    });

  }
}