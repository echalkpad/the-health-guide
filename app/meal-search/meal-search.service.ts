// Angular
import { Injectable } from '@angular/core';

// RxJs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// Nativescript
import { setTimeout } from 'timer';

// THG
import { MAX_SAFE_INTEGER } from '../shared';
import { Meal } from './meal.model';
import { Food, FoodService } from '../food';
import { Recipe, RecipeDataService } from '../recipes';

@Injectable()
export class MealSearchService {
    private _meals: Meal[] = [];
    constructor(
        private _foodSvc: FoodService,
        private _recipeDataSvc: RecipeDataService
    ) { }

    /*

    public getMeals(): Observable<Meal> {
        return new Observable(observer => {
            if (!!this._meals.length) {
                this._meals.forEach((meal: Meal) => observer.next(meal));
            } else {
                this._foodSvc.getFoods(MAX_SAFE_INTEGER, '').subscribe((food: Meal) => {
                    this._meals.push(food);
                    observer.next(food);
                });
                this._recipeDataSvc.getPrivateRecipes(MAX_SAFE_INTEGER, '').subscribe((recipe: Meal) => {
                    this._meals.push(recipe);
                    observer.next(recipe);
                });
            }
        });
    }

    public unsubscribeMeals(): void {
        this._foodSvc.unsubscribeFoods();
        this._recipeDataSvc.unsubscribeRecipes();
    }

    */
}