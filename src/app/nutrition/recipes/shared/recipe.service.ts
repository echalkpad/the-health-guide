import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, FirebaseAuth, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeService {
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

  private portionRecipe(recipe: Recipe): void {
    for (let nutrientCategory in recipe.nutrition) {
      let nutrients = recipe.nutrition[nutrientCategory];
      if (typeof nutrients === 'number') {
        recipe.nutrition[nutrientCategory] /= +recipe.servings;
      } else {
        for (let nutrient in nutrients) {
          recipe.nutrition[nutrientCategory][nutrient] /= +recipe.servings;
        }
      }
      recipe.quantity /= +recipe.servings;
    }
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
    let imgUrl: string = "";
    return this.recipeImgUrl.child(`${imgName}.jpg`).getDownloadURL().then(
      (url: string) => url,
      (err: Error) => this.recipeImgUrl.child("recipe.jpg").getDownloadURL().then((url: string) => url));
  }

  public setRecipeNutrition(recipe: Recipe): void {
    recipe.nutrition = new Nutrition();
    // Set total recipe nutrition and quantity in grams
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.hasOwnProperty('chef')) {
        // The ingredient is a recipe
        for (let nutrientCategory in ingredient.nutrition) {
          let nutrients = ingredient.nutrition[nutrientCategory];
          if (typeof nutrients === 'number') {
            recipe.nutrition[nutrientCategory] += nutrients * ingredient.amount;
          } else {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * ingredient.amount;
            }
          }
        }
      } else {
        // The ingredient is a basic food
        for (let nutrientCategory in ingredient) {
          let nutrients = ingredient[nutrientCategory];
          if (typeof nutrients === 'number') {
            recipe.nutrition[nutrientCategory] += nutrients * (ingredient.quantity / 100);
          } else {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * (ingredient.quantity / 100);
            }
          }
        }
      }

      recipe.quantity += ingredient.quantity;
    });
    this.portionRecipe(recipe);
  }

  public filterRecipes(recipes: Recipe[], query: string, searchTerm: string, ingredients: string[]): Recipe[] {
    return recipes.filter((recipe: Recipe) => {
      let match: boolean = false,
        matchedIngredients: number = 0;
        if (recipe[query].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          match = true;
          if (!!ingredients && !!ingredients.length) {
            ingredients.forEach((item: string) => {
              recipe.ingredients.forEach((ingredient: Ingredient) => {
                if (ingredient.name === item) {
                  matchedIngredients++;
                }
              });
            });
            if (matchedIngredients !== ingredients.length) {
              match = false;
            }
          }
        }
      return match;
    });
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

  public uploadImage(img: File): void {
    this.recipeImgUrl.child(img.name).put(img).then(snapshot => console.log('Uploaded successfully'));
  }
/*
  public updateRecipe(recipe: Recipe): void {
    this.removeHashkeys(recipe);
    this.userRecipes.update(recipe['$key'], {
      name: recipe.name,
      imgUrl: recipe.imgUrl,
      category: recipe.category,
      dietaries: recipe.dietaries,
      chefName: recipe.chefName,
      chefAvatar: recipe.chefAvatar,
      ingredients: recipe.ingredients,
      duration: recipe.duration,
      difficulty: recipe.difficulty,
      cookMethod: recipe.cookMethod,
      cookTemperature: recipe.cookTemperature,
      nutrition: recipe.nutrition,
      servings: recipe.servings,
      steps: recipe.steps,
      quantity: recipe.quantity
    });
  }
  */
}