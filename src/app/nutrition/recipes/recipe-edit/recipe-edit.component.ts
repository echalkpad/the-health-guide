import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

import { Recipe } from '../shared/recipe.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  public recipe: Recipe;
  constructor(
    private detector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) {  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { recipe: Recipe }) => {
      if (!!data) {
        this.recipe = Object.assign({}, data.recipe);
        console.log(this.recipe);
        this.titleSvc.setTitle(this.recipe.name);
        this.detector.markForCheck();
      }
    });
  }

}
