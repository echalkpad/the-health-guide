import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';

@Injectable()
export class RecipeDetailResolve implements Resolve<Recipe> {
  private recipe: Recipe;
  constructor(private recipeSvc: RecipeService, private router: Router) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Recipe> {
    let authId: string = route.params['authId'],
      recipeKey: string = route.params['key'];
    return new Promise((resolve, reject) => {
      if (recipeKey !== '0') {
        this.recipeSvc.getRecipe(authId, recipeKey).subscribe((data: Recipe) => {
          if (!!data) {
            this.recipe = Object.assign({}, data);
          }
        });
        setTimeout(() => {
          if (!this.recipe) {
            this.router.navigate(['recipes']);
          } else {
            resolve(this.recipe);
          }
        }, 3000);
      } else {
        resolve(new Recipe());
      }
    });
  }

}
