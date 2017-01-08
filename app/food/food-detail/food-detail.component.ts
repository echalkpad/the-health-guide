// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// THG
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  moduleId: module.id,
  selector: 'thg-food-detail',
  templateUrl: 'food-detail.component.html',
  styleUrls: ['food-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailComponent implements OnInit {
  public aminoacids: string[] = [];
  public basicNutrition: string[] = [];
  public minerals: string[] = [];
  public food: Food;
  public vitamins: string[] = [];
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _router: RouterExtensions
  ) {

    this.basicNutrition = [
      'Energy',
      'Water',
      'Protein',
      'Carbohydrates',
      'Sugars',
      'Fiber',
      'Fats',
      'Saturated fat',
      'Monounsaturated fat',
      'Polyunsaturated fat',
      'Trans fat'
    ];
  }

  public goBack(): void {
    this._router.back();
  }

  ngOnInit(): void {
    this.food = this._foodSvc.getFood();
    this.aminoacids = Object.keys(this.food['amino acids']);
    this.vitamins = Object.keys(this.food['vitamins']);
    this.minerals = Object.keys(this.food['minerals']);
    this._changeDetectionRef.detectChanges();

  }
}