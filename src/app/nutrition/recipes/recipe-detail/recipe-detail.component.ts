import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

import { Recipe } from '../shared/recipe.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe;
  public aminoacids: string[] = [];
  public basicNutrients: string[] = [];
  public minerals: string[] = [];
  public vitamins: string[] = [];
  constructor(
    private detector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) {
    this.basicNutrients = [
      "Water",
      "Protein",
      "Carbohydrates",
      "Sugars",
      "Fiber",
      "Fats",
      "Saturated fat",
      "Monounsaturated fat",
      "Polyunsaturated fat",
      "Trans fat"
    ];
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { recipe: Recipe }) => {
      if (!!data) {
        this.recipe = Object.assign({}, data.recipe);
        console.log(this.recipe);
        for (let prop in this.recipe.nutrition['amino acids']) {
          this.aminoacids.push(prop);
        }
        for (let prop in this.recipe.nutrition['vitamins']) {
          this.vitamins.push(prop);
        }
        for (let prop in this.recipe.nutrition['minerals']) {
          this.minerals.push(prop);
        }
        this.titleSvc.setTitle(this.recipe.name);
        this.detector.markForCheck();
      }
    });
  }

}
