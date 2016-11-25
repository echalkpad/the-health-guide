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
  public basicDetails: string[];
  public recipe: Recipe;
  constructor(
    private detector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) {
    this.basicDetails = ['Category'];
  }


  ngOnInit(): void {
    this.route.data.subscribe((data: { recipe: Recipe }) => {
      if (!!data) {
        this.recipe = Object.assign({}, data.recipe);
        this.titleSvc.setTitle(this.recipe.name);
        this.detector.markForCheck();
        console.log(this.recipe);
      }
    });
  }

}
