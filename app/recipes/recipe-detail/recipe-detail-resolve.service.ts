// Angular
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// THG
import { Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';

@Injectable()
export class RecipeDetailResolve implements Resolve<Recipe> {

  constructor(private recipeDataSvc: RecipeDataService) { }

  public resolve(): Promise<Recipe> {
    return new Promise(resolve => {
      resolve(this.recipeDataSvc.getRecipe());
    });
  }

}
