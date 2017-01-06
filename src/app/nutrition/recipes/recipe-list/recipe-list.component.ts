import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { FirebaseListObservable } from 'angularfire2';
import { TdDialogService, TdLoadingService } from '@covalent/core';

import { Auth } from '../../../auth/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { DataService } from '../../shared/data.service';
import { Food } from '../../food/shared/food.model';
import { FoodService } from '../../food/shared/food.service';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public auth: Auth;
  public filteredRecipes: Recipe[];
  public filteredSharedRecipes: Recipe[];
  public ingredients: string[];
  public query: string = 'name';
  public queryIngredients: string[] = [];
  public recipes: Recipe[];
  public sharedRecipes: Recipe[];
  constructor(
    private _authSvc: AuthService,
    private _dataSvc: DataService,
    private _dialogSvc: TdDialogService,
    private _foodSvc: FoodService,
    private _loadingSvc: TdLoadingService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _router: Router,
    private _titleSvc: Title
  ) { }

  private _showAlert(title?: string, msg?: string): void {
    this._dialogSvc.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!' || msg,
      disableClose: false,
      title: 'No data found' || title,
      closeButton: 'Close'
    });
  }

  public addIngredient(ingredient: string): void {
    this.queryIngredients.push(ingredient);
    this.filterRecipes('');
  }

  public createRecipe(): void {
    this._dataSvc.saveRecipe(new Recipe(this.auth));
    this._router.navigate([`/nutrition/recipes/${this.auth.id}/0`]);
  }

  public deleteRecipe(recipe: Recipe): void {
    this._recipeDataSvc.removeRecipe(recipe);
  }

  public editRecipe(recipe: Recipe): void {
    this._dataSvc.saveRecipe(recipe);
    this._router.navigate(['/nutrition/recipes', this.auth.id, recipe['$key']]);
  }

  public filterRecipes(searchTerm: string): void {
    this.filteredRecipes = [...this._recipeSvc.filterRecipes(this.recipes, this.query, searchTerm, this.queryIngredients)];
    this.filteredSharedRecipes = [...this._recipeSvc.filterRecipes(this.sharedRecipes, this.query, searchTerm, this.queryIngredients)];
  }

  public openDetails(recipe: Recipe): void {
    this._dataSvc.saveRecipe(recipe);
    this._router.navigate(['/nutrition/recipes', recipe['$key']]);
  }

  public removeIngredient(ingredient: string): void {
    this.queryIngredients.splice(this.queryIngredients.indexOf(ingredient), 1);
    this.filterRecipes('');
  }

  ngAfterViewInit(): void {
    this._loadingSvc.register('my-recipes.load');
    this._loadingSvc.register('shared-recipes.load');
    setTimeout(() => {
      this._loadingSvc.resolve('my-recipes.load');
      this._loadingSvc.resolve('shared-recipes.load');
      if (!this.recipes) {
        this._showAlert('No recipes found', 'You have no recipes currently. Start cooking!');
      }
      if (!this.sharedRecipes) {
        this._showAlert();
      }
    }, 5000);
    this._titleSvc.setTitle('Recipes');
  }

  ngOnInit(): void {
    this._foodSvc.getFoods().subscribe((data: Food[]) => {
      if (!!data && !!data.length) {
        this.ingredients = [...data.map((item: Food) => item.name)];
      }
    });

    this.auth = Object.assign({}, this._authSvc.getAuth());

    this._recipeDataSvc.getPrivateRecipes().subscribe((data: Recipe[]) => {
      if (!!data && !!data.length) {
        this.recipes = [...data];
        this.filteredRecipes = [...data];
        this._loadingSvc.resolve('my-recipes.load');
      }
    });

    this._recipeDataSvc.getSharedRecipes().subscribe((data: Recipe[]) => {
      if (!!data && !!data.length) {
        this.sharedRecipes = [...data];
        this.filteredSharedRecipes = [...data];
        this._loadingSvc.resolve('shared-recipes.load');
      }
    });
  }

}
