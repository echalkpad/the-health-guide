// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import * as application from 'application';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

// THG
import { DrawerService, HelperService } from '../../shared';
import { MealSearchComponent } from '../../meal-search';
import { MealSearchService } from '../../meal-search/meal-search.service'
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
  moduleId: module.id,
  selector: 'thg-recipes',
  templateUrl: 'recipe-list.component.html',
  styleUrls: ['recipe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit {
  private _privateRecipes: Recipe[];
  private _recipeLimit: number = 3;
  private _sharedRecipes: Recipe[];
  public filteredPrivate: Recipe[];
  public filteredShared: Recipe[];
  public ingredients: string[];
  public isLoadingPrivate: boolean = true;
  public isLoadingShared: boolean = true;
  public isSearching: boolean = false;
  public query: string = 'name';
  public queryIngredients: Ingredient[] = [];
  public searchInputPrivate: string = '';
  public searchInputPublic: string = '';
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _helperSvc: HelperService,
    private _mealSearchSvc: MealSearchService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _router: RouterExtensions,
    public drawerSvc: DrawerService
  ) { }

  public changeQuery(): void {
    dialogs.action({
      title: 'Filter type',
      message: 'Choose the search filter',
      cancelButtonText: 'Cancel',
      actions: ['Recipe name', 'Chef', 'Ingredients']
    }).then((result: string) => {
      switch (result) {
        case 'Recipe name':
          this.query = 'name';
          break;
        case 'Chef':
          this.query = 'chef';
          break;
        case 'Ingredients':
          this.query = 'ingredients';
          this._router.navigate(['/meal-search']);
          break;

        default:
          this.query = 'name';
          break;
      }
    });
  }

  public clearSearchPrivate(): void {
    this.searchInputPrivate = '';
    this.filteredPrivate = [...this._privateRecipes];
    this._changeDetectionRef.detectChanges();
    this._changeDetectionRef.markForCheck();
  }

  public clearSearchShared(): void {
    this.searchInputPublic = '';
    this.filteredShared = [...this._sharedRecipes];
    this._changeDetectionRef.detectChanges();
    this._changeDetectionRef.markForCheck();
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._recipeLimit += 3;
    if (this._privateRecipes.length > this.filteredPrivate.length) {
      this.filteredPrivate.push(...this._privateRecipes.slice(this.filteredPrivate.length, this._recipeLimit));
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
      setTimeout(() => args.object.scrollToIndex(this.filteredPrivate.length - 3), 1000);
    }
  }

  public loadMoreShared(args: ListViewEventData): void {
    this._recipeLimit += 3;
    if (this._sharedRecipes.length > this.filteredShared.length) {
      this.filteredShared.push(...this._sharedRecipes.slice(this.filteredShared.length, this._recipeLimit));
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
      setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 3), 1000);
    }
  }

  public openDetails(recipe: Recipe): void {
    this._recipeDataSvc.storeRecipe(recipe);
    setTimeout(() => this._router.navigate(['/recipes', recipe['$key']]), 1000);
  }

  public refreshPrivate(args: ListViewEventData): void {
    this._recipeDataSvc.getPrivateRecipes().then((data: Recipe[]) => {
      this._privateRecipes = this._helperSvc.sortByName(data);
      this.filteredPrivate = [...this._privateRecipes];
      this.filteredPrivate = this.filteredPrivate.slice(0, this._recipeLimit);
      args.object.notifyPullToRefreshFinished();
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public refreshShared(args: ListViewEventData): void {
    this._recipeDataSvc.getSharedRecipes().then((data: Recipe[]) => {
      this._sharedRecipes = this._helperSvc.sortByName(data);
      this.filteredShared = [...this._privateRecipes];
      this.filteredShared = this.filteredShared.slice(0, this._recipeLimit);
      args.object.notifyPullToRefreshFinished();
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public searchPrivate(searchTerm: string): void {
    this.filteredPrivate = this._recipeSvc.filterRecipes(this._privateRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._recipeLimit);
    this._changeDetectionRef.detectChanges();
    this._changeDetectionRef.markForCheck();
  }

  public searchShared(searchTerm: string): void {
    this.filteredShared = this._recipeSvc.filterRecipes(this._sharedRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._recipeLimit);
    this._changeDetectionRef.detectChanges();
    this._changeDetectionRef.markForCheck();
  }

  ngOnInit(): void {
    Promise.all([
      this._recipeDataSvc.getPrivateRecipes(),
      this._recipeDataSvc.getSharedRecipes()
    ]).then((data: Array<Recipe[]>) => {
      this._privateRecipes = [...data[0]];
      this._sharedRecipes = [...data[1]];
      this.queryIngredients = [...this._mealSearchSvc.getSelections()];
      if (!!this.queryIngredients.length) {
        this.filteredPrivate = this._recipeSvc.filterRecipes(this._privateRecipes, this.query, '', this.queryIngredients).slice(0, this._recipeLimit);
        this.filteredShared = this._recipeSvc.filterRecipes(this._sharedRecipes, this.query, '', this.queryIngredients).slice(0, this._recipeLimit);
      } else {
        this.filteredPrivate = [...this._privateRecipes.slice(0, this._recipeLimit)];
        this.filteredShared = [...this._sharedRecipes.slice(0, this._recipeLimit)];
      }
      this.isLoadingPrivate = false;
      this.isLoadingShared = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }
}