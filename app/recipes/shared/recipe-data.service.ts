// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Nativescript
import * as connectivity from 'connectivity';

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
  private _privateObserver: Subscriber<Recipe>;
  private _privateRecipes: Recipe[];
  private _sharedObserver: Subscriber<Recipe>;
  private _sharedRecipes: Recipe[];
  constructor(private _dataSvc: DataService, private _helperSvc: HelperService) {
    this._auth = _dataSvc.getAuth().id;
  }

  public getIngredients(): Ingredient[] {
    return this._ingredients;
  }

  public getPrivateRecipes(withFetch?: boolean): Observable<Recipe> {
    let connectionType = connectivity.getConnectionType();
    if (this._privateObserver && !this._privateObserver.closed) {
      this._privateObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<Recipe>) => {
      this._privateObserver = observer;
      if ((!withFetch && !!this._privateRecipes && !!this._privateRecipes.length) || connectionType === connectivity.connectionType.none) {
        this._privateRecipes.forEach((item: Recipe) => this._privateObserver.next(item));
      } else {
        if (connectionType === connectivity.connectionType.mobile) {
          this.keepOnSyncPrivate();
        }
        this._privateRecipes = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._privateObserver.error(res['error']);
            } else if (res.type === 'ChildAdded') {
              this._privateRecipes.push(res.value);
              this._privateObserver.next(res.value);
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
      }
    });
  }

  public getSharedRecipes(withFetch?: boolean): Observable<Recipe> {
    let connectionType = connectivity.getConnectionType();
    if (this._sharedObserver && !this._sharedObserver.closed) {
      this._sharedObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<Recipe>) => {
      this._sharedObserver = observer;
      if ((!withFetch && !!this._sharedRecipes && !!this._sharedRecipes.length) || connectionType === connectivity.connectionType.none) {
        this._sharedRecipes.forEach((item: Recipe) => this._sharedObserver.next(item));
      } else {
        if (connectionType === connectivity.connectionType.mobile) {
          this.keepOnSyncShared();
        }
        this._sharedRecipes = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._sharedObserver.error(res['error']);
            } else if (res.type === 'ChildAdded') {
              this._sharedRecipes.push(res.value);
              this._sharedObserver.next(res.value);
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
      }
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

}
