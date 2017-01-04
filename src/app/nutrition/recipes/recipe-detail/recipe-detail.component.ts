import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Recipe } from '../shared/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe;
  public aminoacids: string[] = [];
  public basicNutrients: string[] = [];
  public minerals: string[] = [];
  public vitamins: string[] = [];
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _titleSvc: Title
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
      'Omega-3 fatty acids',
      'Omega-6 fatty acids',
      'Trans fat'
    ];
  }

  ngOnInit(): void {
    this._route.data.subscribe((data: { recipe: Recipe }) => {
      this.recipe = Object.assign({}, data.recipe);
        console.log(this.recipe);
        this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
        this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
        this.minerals = Object.keys(this.recipe.nutrition['minerals']);
        this._titleSvc.setTitle(this.recipe.name);
        this._changeDetectionRef.detectChanges();
    });
  }

}
