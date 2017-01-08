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

  public getPrivateRecipes(): Observable<firebase.FBData> {
    if (this._privateObserver && !this._privateObserver.closed) {
      this._privateObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<firebase.FBData>) => {
      this._privateObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._privateObserver.error(res['error']);
          } else {
            this._privateObserver.next(res);
          }
        },
        `recipes/${this._auth}`,
        {
          singleEvent: false,
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

  public getSharedRecipes(): Observable<firebase.FBData> {
    if (this._sharedObserver && !this._sharedObserver.closed) {
      this._sharedObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<firebase.FBData>) => {
      this._sharedObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._sharedObserver.error(res['error']);
          } else {
            this._sharedObserver.next(res);
          }
        },
        'recipes/shared',
        {
          singleEvent: false,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }

  public keepOnSyncPrivate(): void {
    firebase.keepInSync(`/recipes${this._auth}`, true).then(
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
