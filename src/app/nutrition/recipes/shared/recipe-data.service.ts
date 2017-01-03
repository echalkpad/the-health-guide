import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../../../auth/auth.service';
import { HelperService } from '../../../shared/helper.service';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private _recipeImgUrl: firebase.storage.Reference;
  private _privateRecipes: FirebaseListObservable<Recipe[]>;
  private _sharedRecipes: FirebaseListObservable<Recipe[]>;
  constructor(private _af: AngularFire, private _authSvc: AuthService, private _helperSvc: HelperService) {
    this._privateRecipes = _af.database.list(`/recipes/${_authSvc.getAuth().id}`, {
      query: {
        orderByChild: 'name'
      }
    });
    this._sharedRecipes = _af.database.list('/recipes/shared', {
      query: {
        orderByChild: 'name'
      }
    });
    this._recipeImgUrl = firebase.storage().ref().child('/recipes');
  }

  public addRecipe(recipe: Recipe): void {
    this._helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this._privateRecipes.push(recipe);
    if (recipe.shared === true) {
      this._sharedRecipes.push(recipe);
    }
  }

  public downloadImg(imgName: string): firebase.Promise<any> {
    return this._recipeImgUrl.child(`${imgName}`).getDownloadURL();
  }

  public getPrivateRecipes(): FirebaseListObservable<Recipe[]> {
    return this._privateRecipes;
  }

  public getRecipe(authId: string, key: string): FirebaseObjectObservable<Recipe> {
    return this._af.database.object(`/recipes/${authId}/${key}`, {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getSharedRecipes(): FirebaseListObservable<Recipe[]> {
    return this._sharedRecipes;
  }

  public removeRecipe(recipe: Recipe): void {
    this._privateRecipes.remove(recipe['$key']);
    if (recipe.shared === true) {
      this._sharedRecipes.remove(recipe['$key']);
    }
  }

  public updateRecipe(recipe: Recipe): void {
    this._helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this._privateRecipes.update(recipe['$key'], {
      name: recipe.name,
      description: recipe.description,
      image: recipe.image,
      category: recipe.category,
      tags: recipe.tags,
      goodPoints: recipe.goodPoints,
      badPoints: recipe.badPoints,
      chef: recipe.chef,
      ingredients: recipe.ingredients,
      duration: recipe.duration,
      difficulty: recipe.difficulty,
      cookMethod: recipe.cookMethod,
      cookTemperature: recipe.cookTemperature,
      nutrition: recipe.nutrition,
      servings: recipe.servings,
      instructions: recipe.instructions,
      quantity: recipe.quantity,
      shared: recipe.shared
    });

    if (recipe.shared === true) {
      this._sharedRecipes.update(recipe['$key'], {
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        category: recipe.category,
        tags: recipe.tags,
        goodPoints: recipe.goodPoints,
        badPoints: recipe.badPoints,
        chef: recipe.chef,
        ingredients: recipe.ingredients,
        duration: recipe.duration,
        difficulty: recipe.difficulty,
        cookMethod: recipe.cookMethod,
        cookTemperature: recipe.cookTemperature,
        nutrition: recipe.nutrition,
        servings: recipe.servings,
        instructions: recipe.instructions,
        quantity: recipe.quantity,
        shared: recipe.shared
      });
    }
  }

  public uploadImage(img: File): firebase.storage.UploadTask {
    return this._recipeImgUrl.child(img.name).put(img);
  }

}
