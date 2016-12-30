import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'nativescript-plugin-firebase';

import { DataService } from '../../shared';
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private auth: string;
  constructor(private dataSvc: DataService, private helperSvc: HelperService) {
    this.auth = dataSvc.getAuth().id;
    firebase.keepInSync(
      `/recipes${this.auth}`,
      true
    ).then(
      function () {
        console.log("firebase.keepInSync is ON for private recipes");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
      );
    firebase.keepInSync(
      '/recipes/shared',
      true
    ).then(
      function () {
        console.log("firebase.keepInSync is ON for shared recipes");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
      );
  }

  public getPrivateRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            reject(res);
          } else {
            let recipes: Recipe[] = [];
            for (let recipeKey in res.value) {
              recipes.push(res.value[recipeKey]);
            }
            setTimeout(() => resolve(recipes), 3000);
          }
        },
        `recipes/${this.auth}`,
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }

  public getSharedRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            reject(res);
          } else {
             let recipes: Recipe[] = [];
            for (let recipeKey in res.value) {
              recipes.push(res.value[recipeKey]);
            }
            setTimeout(() => resolve(recipes), 3000);
          }
        },
        'recipes/shared',
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }

}
