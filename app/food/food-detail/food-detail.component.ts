// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// THG
import { Food } from '../shared/food.model';

@Component({
  moduleId: module.id,
  selector: 'thg-food-detail',
  templateUrl: 'food-detail.component.html',
  styleUrls: ['food-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailComponent implements OnInit {
  public aminoacids: string[] = [];
  public basicNutrients: string[] = [];
  public minerals: string[] = [];
  public food: Food;
  public vitamins: string[] = [];
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: RouterExtensions
  ) {
    
    this.basicNutrients = [
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
    this._route.data.subscribe((data: { food: Food }) => {
      this.food = data.food;
      this.aminoacids = Object.keys(this.food['amino acids']);
      this.vitamins = Object.keys(this.food['vitamins']);
      this.minerals = Object.keys(this.food['minerals']);
      this._changeDetectionRef.detectChanges();
    });

  }
}