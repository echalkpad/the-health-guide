// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { DataService } from '../../shared';
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private _auth: string;
  private _ingredients: Ingredient[];
  private _privateObserver: Subscriber<firebase.FBData>;
  private _recipe: Recipe;
  private _sharedObserver: Subscriber<firebase.FBData>;
  constructor(private _dataSvc: DataService, private _helperSvc: HelperService) {
    this._auth = _dataSvc.getAuth().id;
  }

  public getIngredients(): Ingredient[] {
    return this._ingredients;
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
        `recipes/${this._auth}`,
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

  public getRecipe(): Recipe {
    return this._recipe;
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

  public keepOnSyncPrivate(): void {
    firebase.keepInSync(`/recipes${this._auth}`,true).then(
      function () {
        console.log("firebase.keepInSync is ON for private recipes");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
    );
  }

  public keepOnSyncShared(): void {
    firebase.keepInSync('/recipes/shared', true).then(
      function () {
        console.log("firebase.keepInSync is ON for shared recipes");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
    );
  }

  public storeIngredients(ingredients: Ingredient[]): void {
    this._ingredients = ingredients;
  }

  public storeRecipe(recipe: Recipe): void {
    this._recipe = recipe;
  }

}
