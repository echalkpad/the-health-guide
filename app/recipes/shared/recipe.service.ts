// Angular
import { Injectable } from '@angular/core';

// Nativescript
import * as fs from 'file-system';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeService {
  private _tags: any;
  constructor() { }

  private _checkCarbPoints(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqCarb: number = energy * 0.45 / 4.1,
      reqFiber: number = energy * 0.06 / 2,
      reqSugars: number = energy * 0.15 / 2.4;

    if (recipe.nutrition.Fiber > reqFiber) {
      recipe.goodPoints.push('High-fiber');
    } else if (recipe.nutrition.Fiber <= reqFiber / 2) {
      recipe.badPoints.push('Low-fiber');
    }

    if (recipe.nutrition.Sugars > reqSugars) {
      recipe.badPoints.push('High-sugar');
    } else if (recipe.nutrition.Sugars <= reqSugars / 2) {
      recipe.goodPoints.push('Low-sugar');
    }

    if (recipe.nutrition.Carbohydrates > reqCarb) {
      recipe.badPoints.push('High-carb');
    } else if (recipe.nutrition.Sugars <= reqSugars / 2) {
      recipe.goodPoints.push('Low-carb');
    }

  }

  private _checkCarbLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Carbohydrates -= recipe.nutrition.Carbohydrates * 0.15;
      recipe.nutrition.Fiber -= recipe.nutrition.Fiber * 0.15;
      recipe.nutrition.Sugars -= recipe.nutrition.Sugars * 0.15;
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Carbohydrates -= recipe.nutrition.Carbohydrates * 0.5;
      recipe.nutrition.Fiber -= recipe.nutrition.Fiber * 0.5;
      recipe.nutrition.Sugars -= recipe.nutrition.Sugars * 0.5;
    }
  }

  private _checkEnergyPoints(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450

    if (energy > reqEnergy) {
      recipe.badPoints.push('High-calorie');
    } else if (energy <= reqEnergy / 2) {
      recipe.goodPoints.push('Low-calorie');
    }
  }

  private _checkHealthTags(recipe: Recipe): void {
    /**
     * The optimal recipe must have max. 900 kcal if it's a breakfast, 450 kcal otherwise,
     * and must contain 45% carbs, 35% fat, 6% fiber, 20% protein, 15% sugars, 10% saturated fat
     * 
     * Carbs have 4.1 kcal/g
     * Fat has 9 kcal/g
     * Fiber has 2 kcal/g
     * Protein has 4.1 kcal/g
     * Sugars have 2.4 kcal/g
     */

    recipe.goodPoints = [];
    recipe.badPoints = [];
    this._checkEnergyPoints(recipe);
    this._checkProteinPoints(recipe);
    this._checkLipidPoints(recipe);
    this._checkCarbPoints(recipe);
    this._checkTags(recipe);
  }

  private _checkTags(recipe: Recipe): void {
    recipe.tags = [];
    if (this._tags.dairyFree === true) {
      recipe.tags.push('Dairy-free');
    }

    if (this._tags.glutenFree === true) {
      recipe.tags.push('Gluten-free');
    }

    if (this._tags.soyFree === true) {
      recipe.tags.push('Soy-free');
    }

    if (this._tags.vegan === true) {
      recipe.tags.push('Vegan');
    }
  }

  private _checkLipidPoints(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqFat: number = energy * 0.35 / 9,
      reqMuFat: number = energy * 0.15 / 9,
      reqPuFat: number = energy * 0.1 / 9,
      reqSatFat: number = energy * 0.1 / 9;

    if (recipe.nutrition.Fats <= Math.min(reqMuFat, reqPuFat) / 2) {
      recipe.badPoints.push('Low-fat');
    }

    if (recipe.nutrition['Saturated fat'] > reqSatFat) {
      recipe.badPoints.push('High saturated fat');
    } else if (recipe.nutrition['Saturated fat'] <= reqSatFat / 2) {
      recipe.goodPoints.push('Low saturated fat');
    }
  }

  private _checkLipidLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Fats -= recipe.nutrition.Fats * 0.15;
      recipe.nutrition['Monounsaturated fat'] -= recipe.nutrition['Monounsaturated fat'] * 0.15;
      recipe.nutrition['Polyunsaturated fat'] -= recipe.nutrition['Polyunsaturated fat'] * 0.15;
      recipe.nutrition['Saturated fat'] -= recipe.nutrition['Saturated fat'] * 0.15;
      recipe.nutrition['Trans fat'] -= recipe.nutrition['Trans fat'] * 0.15;
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Fats -= recipe.nutrition.Fats * 0.5;
      recipe.nutrition['Monounsaturated fat'] -= recipe.nutrition['Monounsaturated fat'] * 0.5;
      recipe.nutrition['Polyunsaturated fat'] -= recipe.nutrition['Polyunsaturated fat'] * 0.5;
      recipe.nutrition['Saturated fat'] -= recipe.nutrition['Saturated fat'] * 0.5;
      recipe.nutrition['Trans fat'] -= recipe.nutrition['Trans fat'] * 0.5;
    }
  }

  private _checkMineralLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching' || recipe.cookMethod === 'Boiling') {
      for (let mineral in recipe.nutrition['minerals']) {
        recipe.nutrition['minerals'][mineral] -= recipe.nutrition['minerals'][mineral] * 0.6;
      }
    } else if (recipe.cookTemperature >= 100) {
      for (let mineral in recipe.nutrition['minerals']) {
        recipe.nutrition['minerals'][mineral] -= recipe.nutrition['minerals'][mineral] * 0.4;
      }
    }
  }

  private _checkNutrientLoss(recipe: Recipe): void {
    this._checkCarbLoss(recipe);
    this._checkLipidLoss(recipe);
    this._checkMineralLoss(recipe);
    this._checkProteinLoss(recipe);
    this._checkVitaminLoss(recipe);
  }

  private _checkProteinLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Boiling') {
      recipe.nutrition.Protein -= recipe.nutrition.Protein * 0.15;
      for (let aa in recipe.nutrition['amino acids']) {
        recipe.nutrition['amino acids'][aa] -= recipe.nutrition['amino acids'][aa] * 0.15;
      }
    }
    if (recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching') {
      recipe.nutrition.Protein -= recipe.nutrition.Protein * 0.5;
      for (let aa in recipe.nutrition['amino acids']) {
        recipe.nutrition['amino acids'][aa] -= recipe.nutrition['amino acids'][aa] * 0.5;
      }
    }
  }

  private _checkProteinPoints(recipe: Recipe): void {
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqProtein: number = energy * 0.2 / 4.1;

    if (recipe.nutrition.Protein > reqProtein) {
      recipe.goodPoints.push('High-protein');
    } else if (recipe.nutrition.Protein <= reqProtein / 2) {
      recipe.badPoints.push('Low-protein');
    }
  }

  private _checkVitaminLoss(recipe: Recipe): void {
    if (recipe.cookTemperature >= 200 || recipe.cookMethod === 'Microwaving' || recipe.cookMethod === 'Blanching' || recipe.cookMethod === 'Boiling') {
      for (let vitamin in recipe.nutrition['vitamins']) {
        recipe.nutrition['vitamins'][vitamin] -= recipe.nutrition['vitamins'][vitamin] * 0.75;
      }
    } else if (recipe.cookTemperature >= 100) {
      for (let vitamin in recipe.nutrition['vitamins']) {
        recipe.nutrition['vitamins'][vitamin] -= recipe.nutrition['vitamins'][vitamin] * 0.5;
      }
    }
  }

  private _portionRecipe(recipe: Recipe): void {
    for (let nutrientCategory in recipe.nutrition) {
      let nutrients = recipe.nutrition[nutrientCategory];
      if (typeof nutrients === 'number') {
        recipe.nutrition[nutrientCategory] /= +recipe.servings;
      } else if (typeof nutrients === 'object') {
        for (let nutrient in nutrients) {
          recipe.nutrition[nutrientCategory][nutrient] /= +recipe.servings;
        }
      }
    }
    recipe.quantity = Math.floor(recipe.quantity / +recipe.servings);
  }

  private _setRemainingNutrition(recipe: Recipe, requiredNutrition: Nutrition): void {
    for (let nutrientCategory in requiredNutrition) {
      let reqNutrients = requiredNutrition[nutrientCategory],
        totalNutrients = recipe.nutrition[nutrientCategory];
      if (typeof reqNutrients === 'number') {
        if (!!reqNutrients) {
          recipe.nutrition[nutrientCategory] = Math.floor((totalNutrients / reqNutrients) * 100);
        } else {
          recipe.nutrition[nutrientCategory] = !!totalNutrients ? 100 : 100 + totalNutrients;
        }
      }
      for (let nutrient in reqNutrients) {
        if (reqNutrients[nutrient] > 0) {
          recipe.nutrition[nutrientCategory][nutrient] = Math.floor((totalNutrients[nutrient] / reqNutrients[nutrient]) * 100);
        } else {
          recipe.nutrition[nutrientCategory][nutrient] = !!totalNutrients[nutrient] ? 100 : 100 + totalNutrients[nutrient];
        }
      }
    }
  }

  public clearImageDownloads(): void {
    fs.knownFolders.documents().getFolder('recipes').remove().then(
      () => console.log('Recipes folder deleted successfully'),
      (err: Error) => console.log('The folder could not be deleted:', err)
    );
  }

  public filterRecipe(recipe: Recipe, query: string = 'name', searchTerm: string = '', ingredients: Ingredient[] = []): boolean {
    let match: boolean = false,
      matchedIngredients: number = 0,
      recipeQuery: string = (query === 'ingredients') ? recipe.name :
        (query === 'chef') ? recipe.chef.name : recipe[query];
    if (recipeQuery.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
      match = true;
      if (!!ingredients && !!ingredients.length) {
        ingredients.forEach((item: Ingredient) => {
          recipe.ingredients.forEach((ingredient: Ingredient) => {
            if (ingredient.name === item.name) {
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
  }

  public filterRecipes(recipes: Recipe[], query: string, searchTerm: string, ingredients: Ingredient[]): Recipe[] {
    return recipes.filter((recipe: Recipe) => {
      let match: boolean = false,
        matchedIngredients: number = 0,
        recipeQuery: string = (query === 'ingredients') ? recipe.name : recipe[query]
      if (recipeQuery.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        match = true;
        if (!!ingredients && !!ingredients.length) {
          ingredients.forEach((item: Ingredient) => {
            recipe.ingredients.forEach((ingredient: Ingredient) => {
              if (ingredient.name === item.name) {
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

  public getImagePath(imageUrl: string): string {
    let documents: fs.Folder = fs.knownFolders.documents(),
      imageName: string = imageUrl.slice(imageUrl.indexOf('%2F') + 3, imageUrl.indexOf('?alt')).split('%20').join(' '),
      imgPath = fs.path.join(documents.path, 'recipes', imageName);

    if (!fs.File.exists(imgPath)) {
      firebase.downloadFile({
        remoteFullPath: `/recipes/${imageName}`,
        localFile: fs.File.fromPath(imgPath)
      }).then(
        () => console.log('File downloaded successfully'),
        (err: Error) => console.log('An error has occured:', err)
        );
    }
    return imgPath;
  }

  public setRecipeNutrition(recipe: Recipe): void {
    recipe.nutrition = new Nutrition();
    recipe.quantity = 0;
    this._tags = {
      dairyFree: true,
      glutenFree: true,
      soyFree: true,
      vegan: true
    }
    // Set total recipe nutrition and quantity in grams
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.category === 'Grains') {
        this._tags.glutenFree = false;
      } else if (ingredient.category === 'Meat') {
        this._tags.vegan = false;
      } else if (ingredient.category === 'Dairy') {
        this._tags.dairyFree = false;
        this._tags.vegan = false;
      }
      if (ingredient.name.toLowerCase().indexOf('soy') !== -1) {
        this._tags.soyFree = false;
      }
      recipe.quantity += ingredient.quantity;
      if (ingredient.hasOwnProperty('nutrition')) {
        // The ingredient is a recipe
        for (let nutrientCategory in ingredient.nutrition) {
          let nutrients = ingredient.nutrition[nutrientCategory];
          if (typeof nutrients === 'number') {
            recipe.nutrition[nutrientCategory] += nutrients * ingredient.quantity;
          } else if (typeof nutrients === 'object') {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * ingredient.quantity;
            }
          }
        }
      } else {
        // The ingredient is a basic food
        for (let nutrientCategory in ingredient) {
          let nutrients = ingredient[nutrientCategory];
          if (typeof nutrients === 'number' && nutrientCategory !== 'quantity') {
            recipe.nutrition[nutrientCategory] += nutrients * (ingredient.quantity / 100);
          } else if (typeof nutrients === 'object') {
            for (let nutrient in nutrients) {
              recipe.nutrition[nutrientCategory][nutrient] += nutrients[nutrient] * (ingredient.quantity / 100);
            }
          }
        }
      }
    });

    this._checkNutrientLoss(recipe);
    this._portionRecipe(recipe);
    this._checkHealthTags(recipe);
  }

}