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
  ) {  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { recipe: Recipe }) => {
      if (!!data) {
        this.recipe = Object.assign({}, data.recipe);
        for (let prop in this.recipe.nutrition) {
          if (typeof this.recipe.nutrition[prop] === 'number') {
            this.basicNutrients.push(prop);
          }
        }
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
