import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseAuth, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { HelperService } from '../../../shared/helper.service';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

const recipeImgUrl: string  = 'https://firebasestorage.googleapis.com/v0/b/the-health-guide.appspot.com/o/recipes%2Frecipe.jpg?alt=media&token=c645fc32-7273-43f5-a198-33b8a041a719';

@Injectable()
export class RecipeDataService {
  private allUsersRecipes: FirebaseListObservable<Recipe[]>;
  private recipeImgUrl: firebase.storage.Reference;
  private userRecipes: FirebaseListObservable<Recipe[]>;
  constructor(private af: AngularFire, private auth: FirebaseAuth, private helperSvc: HelperService) {
    this.allUsersRecipes = af.database.list('/recipes', {
      query: {
        orderByChild: 'name'
      }
    });
    auth.subscribe(authData => {
      if (!!authData) {
        this.userRecipes = af.database.list(`/recipes/${authData.uid}`, {
          query: {
            orderByChild: 'name'
          }
        });
      }
    });
    this.recipeImgUrl = firebase.storage().ref().child('/recipes');
  }

  public addRecipe(recipe: Recipe): void {
    this.helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this.userRecipes.push(recipe);
  }

  public downloadImg(imgName: string): firebase.Promise<any> {
    return this.recipeImgUrl.child(`${imgName}`).getDownloadURL();
  }

  public getAllRecipes(): Observable<any> {
    let allRecipes: Recipe[] = [];
    return new Observable(observer => {
      this.allUsersRecipes.subscribe(users => users.forEach(userRecipes => {
        if (!!userRecipes) {
          for (let recipeKey in userRecipes) {
            let recipe = userRecipes[recipeKey];
            if (recipe.hasOwnProperty('ingredients')) {
              allRecipes.push(recipe);
            }
          }
          observer.next(allRecipes);
        }
      }));
    });

  }

  public getMyRecipes(authId: string): FirebaseListObservable<Recipe[]> {
    return this.af.database.list(`/recipes/${authId}`, {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getRecipe(authId: string, key: string): FirebaseObjectObservable<Recipe> {
    return this.af.database.object(`/recipes/${authId}/${key}`, {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public removeRecipe(recipe: Recipe): void {
    this.userRecipes.remove(recipe['$key']);
  }

  public updateRecipe(recipe: Recipe): void {
    this.helperSvc.removeHashkeys(recipe.ingredients);
    recipe.image = (recipe.image === "") ? recipeImgUrl : recipe.image;
    this.userRecipes.update(recipe['$key'], {
      name: recipe.name,
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
      quantity: recipe.quantity
    });
  }

  public uploadImage(img: File): firebase.storage.UploadTask {
    return this.recipeImgUrl.child(img.name).put(img);
  }

}
