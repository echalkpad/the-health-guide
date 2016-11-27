import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve} from '@angular/router';

import { DataService } from '../../shared/data.service';
import { Recipe } from '../shared/recipe.model';

@Injectable()
export class RecipeDetailResolve implements Resolve<Recipe> {

  constructor(private dataSvc: DataService) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Recipe> {
    let recipeKey: string = route.params['key'];
    return new Promise((resolve, reject) => {
      if (recipeKey !== '0') {
        resolve(this.dataSvc.storage.recipe);
      } else {
        resolve(new Recipe(this.dataSvc.storage.auth));
      }
    });
  }

}
