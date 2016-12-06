import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseAuth, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeDataService {
  private allUsersRecipes: FirebaseListObservable<Recipe[]>;
  private recipeImgUrl: firebase.storage.Reference;
  private userRecipes: FirebaseListObservable<Recipe[]>;
  constructor(private af: AngularFire, private auth: FirebaseAuth) {
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

  private removeHashkeys(recipe: Recipe): void {
    recipe.ingredients.forEach((ingredient: Ingredient) => {
      if (ingredient.hasOwnProperty('$key')) {
        delete ingredient['$key'];
      }
      if (ingredient.hasOwnProperty('$exists')) {
        delete ingredient['$exists'];
      }
    });
  }

  public addRecipe(recipe: Recipe): void {
    this.removeHashkeys(recipe);
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
    this.removeHashkeys(recipe);
    this.userRecipes.update(recipe['$key'], {
      name: recipe.name,
      image: recipe.image,
      category: recipe.category,
      tags: recipe.tags,
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
