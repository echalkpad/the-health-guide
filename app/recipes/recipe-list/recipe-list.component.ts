// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import * as application from 'application';
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
  private _privateLimit: number = 5;
  private _privateRecipes: Recipe[];
  private _sharedLimit: number = 5;
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
  public searchInputShared: string = '';
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
    this.refreshPrivate();
  }

  public clearSearchShared(): void {
    this.searchInputShared = '';
    this.refreshShared();
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._privateLimit += 5;
    this.refreshPrivate();
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredPrivate.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredPrivate.length - 5), 500);
      }
    }, 3000);
  }

  public loadMoreShared(args: ListViewEventData): void {
    this._sharedLimit += 5;
    this.refreshPrivate();
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredShared.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 5), 500);
      }
    }, 3000);
  }

  public openDetails(recipe: Recipe): void {
    this._recipeDataSvc.storeRecipe(recipe);
    setTimeout(() => this._router.navigate(['/recipes', recipe['$key']]), 1000);
  }

  public refreshPrivate(args?: ListViewEventData): void {
    this._privateRecipes = [];
    this._recipeDataSvc.getPrivateRecipes().subscribe((data: firebase.FBData) => {
      if (
        this._privateRecipes.length < this._privateLimit
        && data.value.name.toLocaleLowerCase().indexOf(this.searchInputPrivate.toLocaleLowerCase()) !== -1
        && data.type === 'ChildAdded'
      ) {
        let newRecipe: Recipe = data.value;
        newRecipe.$key = data.key;
        this._privateRecipes.push(newRecipe);
      } else if (data.type === 'ChildChanged' || data.type === 'ChildMoved') {
        this._privateRecipes.forEach((food: Recipe, idx: number) => {
          if (food.$key === data.key) {
            let newRecipe: Recipe = data.value;
            newRecipe.$key = data.key;
            this._privateRecipes[idx] = newRecipe;
          }
        });
      } else if (data.type === 'ChildRemoved') {
        this._privateRecipes.forEach((food: Recipe, idx: number) => {
          if (food.$key === data.key) {
            this._privateRecipes.splice(idx, 1);
          }
        });
      }
      this.filteredPrivate = [...this._privateRecipes];
      this.isLoadingPrivate = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public refreshShared(args?: ListViewEventData): void {
    this._privateRecipes = [];
    this._recipeDataSvc.getSharedRecipes().subscribe((data: firebase.FBData) => {
      if (
        this._privateRecipes.length < this._privateLimit
        && data.value.name.toLocaleLowerCase().indexOf(this.searchInputShared.toLocaleLowerCase()) !== -1
        && data.type === 'ChildAdded'
      ) {
        let newRecipe: Recipe = data.value;
        newRecipe.$key = data.key;
        this._privateRecipes.push(newRecipe);
      } else if (data.type === 'ChildChanged' || data.type === 'ChildMoved') {
        this._privateRecipes.forEach((food: Recipe, idx: number) => {
          if (food.$key === data.key) {
            let newRecipe: Recipe = data.value;
            newRecipe.$key = data.key;
            this._privateRecipes[idx] = newRecipe;
          }
        });
      } else if (data.type === 'ChildRemoved') {
        this._privateRecipes.forEach((food: Recipe, idx: number) => {
          if (food.$key === data.key) {
            this._privateRecipes.splice(idx, 1);
          }
        });
      }
      this.filteredShared = [...this._privateRecipes];
      this.isLoadingShared = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public searchPrivate(searchTerm: string): void {
    this.searchInputPrivate = searchTerm;
    this.refreshPrivate();
  }

  public searchShared(searchTerm: string): void {
    this.searchInputShared = searchTerm;
    this.refreshShared();
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this._recipeDataSvc.keepOnSyncPrivate();
      this.refreshPrivate();
      this._recipeDataSvc.keepOnSyncShared();
      this.refreshShared();
    }, 3000);
  }
}