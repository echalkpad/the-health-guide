import { Injectable } from '@angular/core';

import { DataService } from '../../../fitness/shared/data.service';
import { Fitness } from '../../../fitness/fitness.model';
import { Ingredient, Recipe } from './recipe.model';
import { Nutrition } from '../../shared/nutrition.model';

@Injectable()
export class RecipeService {
  constructor(private dataSvc: DataService) { }

  private checkHealthTags(recipe: Recipe): void {
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
    let energy: number = recipe.nutrition.Energy,
      reqEnergy: number = (recipe.category === 'Breakfasts') ? 900 : 450,
      reqCarb: number = energy * 0.45 / 4.1,
      reqFat: number = energy * 0.35 / 9,
      reqFiber: number = energy * 0.06 / 2,
      reqProtein: number = energy * 0.2 / 4.1,
      reqSatFat: number = energy * 0.1 / 9,
      reqSugars: number = energy * 0.15 / 2.4;

    if (energy > reqEnergy) {
      if (recipe.tags.indexOf('High-calorie') === -1) {
        recipe.tags.push('High-calorie');
      }
      if (recipe.tags.indexOf('Low-calorie') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-calorie'), 1);
      }
    } else if (energy <= reqEnergy / 2) {
      if (recipe.tags.indexOf('Low-calorie') === -1) {
        recipe.tags.push('Low-calorie');
      }
      if (recipe.tags.indexOf('High-calorie') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-calorie'), 1);
      }
    } else if (recipe.tags.indexOf('High-calorie') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-calorie'), 1);
    } else if (recipe.tags.indexOf('Low-calorie') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-calorie'), 1);
    }

    if (recipe.nutrition.Fats > reqFat) {
      if (recipe.tags.indexOf('High-fat (good)') === -1) {
        recipe.tags.push('High-fat (good)');
      }
      if (recipe.tags.indexOf('Low-fat (bad)') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-fat (bad)'), 1);
      }
    } else if (recipe.nutrition.Fats <= reqFat / 2) {
      if (recipe.tags.indexOf('Low-fat (bad)') === -1) {
        recipe.tags.push('Low-fat (bad)');
      }
      if (recipe.tags.indexOf('High-fat (good)') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-fat (good)'), 1);
      }
    } else if (recipe.tags.indexOf('High-fat (good)') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-fat (good)'), 1);
    } else if (recipe.tags.indexOf('Low-fat (bad)') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-fat (bad)'), 1);
    }

    if (recipe.nutrition.Fiber > reqFiber) {
      if (recipe.tags.indexOf('High-fiber') === -1) {
        recipe.tags.push('High-fiber');
      }
      if (recipe.tags.indexOf('Low-fiber') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-fiber'), 1);
      }
    } else if (recipe.nutrition.Fiber <= reqFiber / 2) {
      if (recipe.tags.indexOf('Low-fiber') === -1) {
        recipe.tags.push('Low-fiber');
      }
      if (recipe.tags.indexOf('High-fiber') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-fiber'), 1);
      }
    } else if (recipe.tags.indexOf('High-fiber') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-fiber'), 1);
    } else if (recipe.tags.indexOf('Low-fiber') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-fiber'), 1);
    }

    if (recipe.nutrition.Protein > reqProtein) {
      if (recipe.tags.indexOf('High-protein') === -1) {
        recipe.tags.push('High-protein');
      }
      if (recipe.tags.indexOf('Low-protein') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-protein'), 1);
      }
    } else if (recipe.nutrition.Protein <= reqProtein / 2) {
      if (recipe.tags.indexOf('Low-protein') === -1) {
        recipe.tags.push('Low-protein');
      }
      if (recipe.tags.indexOf('High-protein') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-protein'), 1);
      }
    } else if (recipe.tags.indexOf('High-protein') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-protein'), 1);
    } else if (recipe.tags.indexOf('Low-protein') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-protein'), 1);
    }

    if (recipe.nutrition['Saturated fat'] > reqSatFat) {
      if (recipe.tags.indexOf('High-fat (bad)') === -1) {
        recipe.tags.push('High-fat (bad)');
      }
      if (recipe.tags.indexOf('Low-fat (good)') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-fat (good)'), 1);
      }
    } else if (recipe.nutrition['Saturated fat'] <= reqSatFat / 2) {
      if (recipe.tags.indexOf('Low-fat (good)') === -1) {
        recipe.tags.push('Low-fat (good)');
      }
      if (recipe.tags.indexOf('High-fat (bad)') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-fat (bad)'), 1);
      }
    } else if (recipe.tags.indexOf('High-fat (bad)') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-fat (bad)'), 1);
    } else if (recipe.tags.indexOf('Low-fat (good)') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-fat (good)'), 1);
    }

    if (recipe.nutrition.Sugars > reqSugars) {
      if (recipe.tags.indexOf('High-sugar') === -1) {
        recipe.tags.push('High-sugar');
      }
      if (recipe.tags.indexOf('Low-sugar') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('Low-sugar'), 1);
      }
    } else if (recipe.nutrition.Sugars <= reqSugars / 2) {
      if (recipe.tags.indexOf('Low-sugar') === -1) {
        recipe.tags.push('Low-sugar');
      }
      if (recipe.tags.indexOf('High-fiber') !== -1) {
        recipe.tags.splice(recipe.tags.indexOf('High-sugar'), 1);
      }
    } else if (recipe.tags.indexOf('High-fiber') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('High-sugar'), 1);
    } else if (recipe.tags.indexOf('Low-sugar') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Low-sugar'), 1);
    }
  }

  private portionRecipe(recipe: Recipe): void {
    for (let nutrientCategory in recipe.nutrition) {
      let nutrients = recipe.nutrition[nutrientCategory];
      if (typeof nutrients === 'number') {
        recipe.nutrition[nutrientCategory] /= +recipe.servings;
        if (recipe.cookMethod !== 'Raw' || recipe.cookMethod !== 'Pickling' || recipe.cookMethod !== 'Pasteurization') {
          recipe.nutrition[nutrientCategory] -= recipe.nutrition[nutrientCategory] * 0.15
        }
      } else if (typeof nutrients === 'object') {
        for (let nutrient in nutrients) {
          recipe.nutrition[nutrientCategory][nutrient] /= +recipe.servings;
          if (recipe.cookMethod !== 'Raw' || recipe.cookMethod !== 'Pickling' || recipe.cookMethod !== 'Pasteurization') {
            if (recipe.cookMethod === 'Freezing') {
              recipe.nutrition[nutrientCategory][nutrient] -= recipe.nutrition[nutrientCategory][nutrient] * 0.05
            } else if (nutrientCategory === 'vitamins') {
              recipe.nutrition[nutrientCategory][nutrient] -= recipe.nutrition[nutrientCategory][nutrient] * 0.65
            } else if (nutrientCategory === 'minerals') {
              recipe.nutrition[nutrientCategory][nutrient] -= recipe.nutrition[nutrientCategory][nutrient] * 0.45
            } else if (nutrientCategory === 'amino acids') {
              recipe.nutrition[nutrientCategory][nutrient] -= recipe.nutrition[nutrientCategory][nutrient] * 0.15
            }
          }
        }
      }
    }
    recipe.quantity = Math.floor(recipe.quantity / +recipe.servings);
  }

  private setRemainingNutrition(recipe: Recipe, requiredNutrition: Nutrition): void {
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

  public setRecipeNutrition(recipe: Recipe): void {
    let dairyFree: boolean = true,
      glutenFree: boolean = true,
      soyFree: boolean = true,
      vegan: boolean = true
    recipe.nutrition = new Nutrition();
    recipe.quantity = 0;
    // Set total recipe nutrition and quantity in grams
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.category === 'Grains') {
        glutenFree = false;
      } else if (ingredient.category === 'Meat') {
        vegan = false;
      } else if (ingredient.category === 'Dairy') {
        dairyFree = false;
      }
      if (ingredient.name.toLowerCase().indexOf('soy') !== -1) {
        soyFree = false;
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
    if (dairyFree) {
      if (recipe.tags.indexOf('Dairy-free') === -1) {
        recipe.tags.push('Dairy-free');
      }
    } else if (recipe.tags.indexOf('Dairy-free') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Dairy-free'), 1);
    }
    if (glutenFree) {
      if (recipe.tags.indexOf('Gluten-free') === -1) {
        recipe.tags.push('Gluten-free');
      }
    } else if (recipe.tags.indexOf('Gluten-free') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Gluten-free'), 1);
    }
    if (soyFree) {
      if (recipe.tags.indexOf('Soy-free') === -1) {
        recipe.tags.push('Soy-free');
      }
    } else if (recipe.tags.indexOf('Soy-free') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Soy-free'), 1);
    }
    if (vegan) {
      if (recipe.tags.indexOf('Vegan') === -1) {
        recipe.tags.push('Vegan');
      }
    } else if (recipe.tags.indexOf('Vegan') !== -1) {
      recipe.tags.splice(recipe.tags.indexOf('Vegan'), 1);
    }

    this.portionRecipe(recipe);
    this.checkHealthTags(recipe);
  }

}