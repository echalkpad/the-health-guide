import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AngularFire, FirebaseListObservable } from "angularfire2";
import { TdDialogService, TdLoadingService } from '@covalent/core';

import { Food } from '../../food/shared/food.model';
import { FoodService } from '../../food/shared/food.service';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public authId: string;
  public avatarUrl: string;
  public chefName: string;
  public filteredRecipes: Recipe[];
  public ingredients: string[];
  public query: string = 'name';
  public queryIngredients: string[] = [];
  public recipeImg: string;
  public recipes: Recipe[];
  constructor(
    private af: AngularFire,
    private dialogService: TdDialogService,
    private foodSvc: FoodService,
    private loadingSvc: TdLoadingService,
    private recipeSvc: RecipeService,
    private router: Router,
    private titleSvc: Title
  ) { }

  public addIngredient(ingredient: string): void {
    this.queryIngredients.push(ingredient);
    this.filterRecipes('');
  }

  public removeIngredient(ingredient: string): void {
    this.queryIngredients.splice(this.queryIngredients.indexOf(ingredient), 1);
    this.filterRecipes('');
  }

  public createRecipe(): void {
    this.router.navigate([`/nutrition/recipes/${this.authId}/0/edit`]);
  }

  public filterRecipes(searchTerm: string): void {
    this.filteredRecipes = [...this.recipeSvc.filterRecipes(this.recipes, this.query, searchTerm, this.queryIngredients)];
  }

  private showAlert(): void {
    this.dialogService.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    }).afterClosed().subscribe(() => this.router.navigate(['/nutrition']));
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
    this.recipeSvc.downloadImg('recipe').then((url: string) => this.recipeImg = url);
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authId = auth.uid;
        this.chefName = auth.auth.providerData[0].displayName;
        this.avatarUrl = auth.auth.providerData[0].photoURL;
        this.recipeSvc.getMyRecipes(this.authId).subscribe((data: Recipe[]) => {
          if (!!data && !!data.length) {
            this.recipes = [...data];
            this.filteredRecipes = [...data];
          }
        });
      }
    });
  }

}
