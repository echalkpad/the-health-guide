// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Lodash
import * as _ from 'lodash';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { DataService } from '../../shared';
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { MAX_SAFE_INTEGER } from '../../shared';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private _auth: string;
  private _ingredients: Ingredient[];
  private _privateObserver: Subscriber<Recipe>;
  private _sharedObserver: Subscriber<Recipe>;
  constructor(
    private _dataSvc: DataService,
    private _helperSvc: HelperService,
    private _recipeSvc: RecipeService
  ) {
    this._auth = _dataSvc.getAuth().id;
  }

  public addRecipe(recipe: Recipe): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.push(`recipes/${this._auth}`, recipe).then((result: firebase.PushResult) => {
        if (recipe.isPublic) {
          firebase.setValue(`recipes/shared/${result.key}`, recipe)
            .then(() => resolve(true))
            .catch((err: Error) => reject(err));
        }
      });
    });
  }

  public getIngredients(): Ingredient[] {
    return this._ingredients;
  }

  public getPrivateRecipes(limit: number, searchQuery: string, searchBy?: string, ingredientsQuery?: Ingredient[]): Observable<Recipe> {
    limit = searchQuery !== '' ? MAX_SAFE_INTEGER : limit;

    return new Observable((observer: Subscriber<Recipe>) => {
      this._privateObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._privateObserver.error(res['error']);
          } else if (this._recipeSvc.isMatch(res.value, searchBy, searchQuery, ingredientsQuery)) {
            let newRecipe: Recipe = _.assign({ $key: res.key, $type: res.type }, res.value);
            this._privateObserver.next(newRecipe);
          }
        },
        `recipes/${this._auth}`,
        {
          singleEvent: false,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          },
          limit: {
            type: firebase.QueryLimitType.FIRST,
            value: limit
          }
        }
      );
    });
  }

  public getSharedRecipes(limit: number, searchQuery: string, searchBy?: string, ingredientsQuery?: Ingredient[]): Observable<Recipe> {
    limit = searchQuery !== '' ? MAX_SAFE_INTEGER : limit;

    return new Observable((observer: Subscriber<Recipe>) => {
      this._sharedObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._sharedObserver.error(res['error']);
          } else if (this._recipeSvc.isMatch(res.value, searchBy, searchQuery, ingredientsQuery)) {
            let newRecipe: Recipe = _.assign({ $key: res.key, $type: res.type }, res.value);
            this._sharedObserver.next(newRecipe);
          }
        },
        `recipes/${this._auth}`,
        {
          singleEvent: false,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          },
          limit: {
            type: firebase.QueryLimitType.FIRST,
            value: limit
          }
        }
      );
    });
  }

  public removeRecipe(recipe: Recipe): Promise<boolean> {
    return firebase.remove(`recipes/${this._auth}/${recipe.$key}`);
  }

  public storeIngredients(ingredients: Ingredient[]): void {
    this._ingredients = ingredients;
  }

  public unsubscribeRecipes(): void {
    if (!!this._privateObserver && !this._privateObserver.closed) {
      this._privateObserver.unsubscribe();
    }
    if (!!this._sharedObserver && !this._sharedObserver.closed) {
      this._sharedObserver.unsubscribe();
    }
  }

  public updateRecipe(recipe: Recipe): Promise<boolean> {
    let recipeKey: string = recipe.$key;
    delete recipe.$key;
    delete recipe.$type;

    return firebase.update(`recipes/${this._auth}/${recipeKey}`, recipe);
  }

}
