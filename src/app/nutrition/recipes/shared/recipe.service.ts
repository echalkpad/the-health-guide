import { Injectable } from '@angular/core';

import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeService {
  constructor() { }

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

  public filterIngredients(ingredients: Ingredient[], searchTerm: string = ''): Ingredient[] {
    return ingredients.filter((ingredient: Ingredient) => ingredient.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
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

  public paginate(data: any[], start: number, end: number): any[] {
    if (start >= 1) {
      data = data.slice(start - 1, end);
    }
    return data;
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

}