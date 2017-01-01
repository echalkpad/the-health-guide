// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';

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
  private privateRecipes: Recipe[];
  private recipeLimit: number = 3;
  private sharedRecipes: Recipe[];
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
    private changeDetectionRef: ChangeDetectorRef,
    private helperSvc: HelperService,
    private mealSearchSvc: MealSearchService,
    private recipeDataSvc: RecipeDataService,
    private recipeSvc: RecipeService,
    private router: RouterExtensions,
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
          this.router.navigate(['/meal-search']);
          break;

        default:
          this.query = 'name';
          break;
      }
    });
  }

  public clearSearchPrivate(): void {
    this.searchInputPrivate = '';
    this.filteredPrivate = [...this.privateRecipes];
  }

  public clearSearchShared(): void {
    this.searchInputPublic = '';
    this.filteredShared = [...this.sharedRecipes];
  }

  public loadMorePrivate(args: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().recipeLimit += 10;
    if (that.get().privateRecipes.length > that.get().filteredPrivate.length) {
      that.get().filteredPrivate.push(...that.get().privateRecipes.slice(that.get().filteredPrivate.length, that.get().recipeLimit));
      setTimeout(() => {
        args.object.scrollToIndex(that.get().filteredPrivate.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public loadMoreShared(args: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().recipeLimit += 10;
    if (that.get().sharedRecipes.length > that.get().filteredShared.length) {
      that.get().filteredShared.push(...that.get().sharedRecipes.slice(that.get().filteredShared.length, that.get().recipeLimit));
      setTimeout(() => {
        args.object.scrollToIndex(that.get().filteredShared.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public openDetails(recipe: Recipe): void {
    this.recipeDataSvc.storeRecipe(recipe);
    setTimeout(() => this.router.navigate(['/recipes', recipe['$key']]), 1000);
  }

  public refreshPrivate(args: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().recipeDataSvc.getPrivateRecipes().then((data: Recipe[]) => {
      that.get().privateRecipes = that.get().helperSvc.sortByName(data);
      that.get().filteredPrivate = [...that.get().privateRecipes];
      that.get().filteredPrivate = that.get().filteredPrivate.slice(0, that.get().recipeLimit);
      that.get().isLoadingPrivate = false;
      setTimeout(() => {
        args.object.notifyPullToRefreshFinished();
        that.get().changeDetectionRef.markForCheck();
      }, 2000);
    });
  }

  public refreshShared(args: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().recipeDataSvc.getSharedRecipes().then((data: Recipe[]) => {
      that.get().sharedRecipes = that.get().helperSvc.sortByName(data);
      that.get().filteredShared = [...that.get().privateRecipes];
      that.get().filteredShared = that.get().filteredShared.slice(0, that.get().recipeLimit);
      that.get().isLoadingShared = false;
      setTimeout(() => {
        args.object.notifyPullToRefreshFinished();
        that.get().changeDetectionRef.markForCheck();
      }, 2000);
    });
  }

  public searchPrivate(searchTerm: string): void {
    this.filteredPrivate = this.recipeSvc.filterRecipes(this.privateRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this.recipeLimit);
  }

  public searchShared(searchTerm: string): void {
    this.filteredShared = this.recipeSvc.filterRecipes(this.sharedRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this.recipeLimit);
  }

  ngOnInit(): void {
    Promise.all([
      this.recipeDataSvc.getPrivateRecipes(),
      this.recipeDataSvc.getSharedRecipes()
    ]).then((data: Array<Recipe[]>) => {
      this.privateRecipes = [...data[0]];
      this.sharedRecipes = [...data[1]];
      this.queryIngredients = [...this.mealSearchSvc.getSelections()];
      if (!!this.queryIngredients.length) {
        this.filteredPrivate = this.recipeSvc.filterRecipes(this.privateRecipes, this.query, '', this.queryIngredients).slice(0, this.recipeLimit);
        this.filteredShared = this.recipeSvc.filterRecipes(this.sharedRecipes, this.query, '', this.queryIngredients).slice(0, this.recipeLimit);
      } else {
        this.filteredPrivate = [...this.privateRecipes.slice(0, this.recipeLimit)];
        this.filteredShared = [...this.privateRecipes.slice(0, this.recipeLimit)];
      }
      this.isLoadingPrivate = false;
      this.isLoadingShared = false;
      this.changeDetectionRef.markForCheck();
    });
  }
}