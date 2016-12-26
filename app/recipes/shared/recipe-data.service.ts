import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../shared';
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  constructor(private dataSvc: DataService, private helperSvc: HelperService) {
  }

}
