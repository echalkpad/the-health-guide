import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { FirebaseListObservable } from "angularfire2";
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
  public ingredients: string[];
  public query: string = 'name';
  public queryIngredients: string[] = [];
  public recipeImg: string;
  public recipes: Recipe[];
  constructor(
    private authSvc: AuthService,
    private dataSvc: DataService,
    private dialogService: TdDialogService,
    private foodSvc: FoodService,
    private loadingSvc: TdLoadingService,
    private recipeDataSvc: RecipeDataService,
    private recipeSvc: RecipeService,
    private router: Router,
    private titleSvc: Title
  ) { }

  public addIngredient(ingredient: string): void {
    this.queryIngredients.push(ingredient);
    this.filterRecipes('');
  }

  public createRecipe(): void {
    this.dataSvc.saveRecipe(new Recipe(this.auth));
    this.router.navigate([`/nutrition/recipes/${this.auth.id}/0/edit`]);
  }

  public filterRecipes(searchTerm: string): void {
    this.filteredRecipes = [...this.recipeSvc.filterRecipes(this.recipes, this.query, searchTerm, this.queryIngredients)];
  }

  public openDetails(recipe: Recipe): void {
    this.dataSvc.saveRecipe(recipe);
    this.router.navigate(['/nutrition/recipes', this.auth.id, recipe['$key']]);
  }

  public removeIngredient(ingredient: string): void {
    this.queryIngredients.splice(this.queryIngredients.indexOf(ingredient), 1);
    this.filterRecipes('');
  }

  private showAlert(): void {
    this.dialogService.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    });
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('recipes.load');
    setTimeout(() => {
      this.loadingSvc.resolve('recipes.load');
      if (!this.recipes) {
        this.showAlert();
      }
    }, 5000);
    this.titleSvc.setTitle("Recipes");
  }

  ngOnInit(): void {
    this.foodSvc.getFoods().subscribe((data: Food[]) => {
      if (!!data && !!data.length) {
        this.ingredients = [...data.map((item: Food) => item.name)];
      }
    });

    this.auth = Object.assign({}, this.authSvc.getAuthData());

    this.recipeDataSvc.getMyRecipes(this.auth.id).subscribe((data: Recipe[]) => {
      if (!!data && !!data.length) {
        this.recipes = [...data];
        this.filteredRecipes = [...data];
      }
    });
  }

}
