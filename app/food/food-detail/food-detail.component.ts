// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Nativescript
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

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
export class FoodDetailComponent {
  public aminoacids: string[];
  public basicNutrition: string[];
  public minerals: string[];
  public food: Food;
  public vitamins: string[];
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _params: ModalDialogParams
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

    this.food = _params.context;
    this.aminoacids = Object.keys(this.food['amino acids']);
    this.vitamins = Object.keys(this.food['vitamins']);
    this.minerals = Object.keys(this.food['minerals']);
  }

  public goBack(): void {
    this._params.closeCallback();
  }
}