// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NavigationExtras } from '@angular/router';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import * as application from 'application';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';

// THG
import { AuthService } from '../../auth';
import { DrawerService, HelperService } from '../../shared';
import { MealSearchComponent } from '../../meal-search';
//import { MealSearchService } from '../../meal-search/meal-search.service';
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
export class RecipeListComponent implements OnDestroy, OnInit {
  private _privateLimit: number = 5;
  private _privateRecipes: Recipe[];
  private _sharedLimit: number = 10;
  private _sharedRecipes: Recipe[];
  public filteredPrivate: Recipe[];
  public filteredShared: Recipe[];
  public gridView: boolean = false;
  public ingredients: string[];
  public isLoadingPrivate: boolean = true;
  public isLoadingShared: boolean = true;
  public isSearching: boolean = false;
  public listView: boolean = true;
  public query: string = 'name';
  public queryIngredients: Ingredient[] = [];
  public searchInputPrivate: string = '';
  public searchInputShared: string = '';
  constructor(
    private _authSvc: AuthService,
    private _changeDetectionRef: ChangeDetectorRef,
    private _helperSvc: HelperService,
    //private _mealSearchSvc: MealSearchService,
    private _modalSvc: ModalDialogService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _router: RouterExtensions,
    private _viewRef: ViewContainerRef,
    public drawerSvc: DrawerService
  ) { }

  private _editRecipe(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(recipe) }
      }
    setTimeout(() => this._router.navigate(['/recipes', this._authSvc.getAuth().id, recipe.$key], navExtras), 1000);
  }

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
          /*
          this._mealSearchSvc.saveSelections(this.queryIngredients);
          let navExtras: NavigationExtras = {
            queryParams: { meals: JSON.stringify(this.queryIngredients) }
          };
          this._router.navigate(['/meal-search'], navExtras);
          */
          
          let options: ModalDialogOptions = {
            viewContainerRef: this._viewRef,
            context: {
                meals: this.queryIngredients
            },
            fullscreen: true
        };

        this._modalSvc.showModal(MealSearchComponent, options)
            .then((ingredients: Ingredient[]) => this.queryIngredients = [...ingredients]);
            
          break;

        default:
          this.query = 'name';
          break;
      }
    });
  }

  public changeView(viewType: string): void {
    if (viewType === 'grid') {
      this.listView = false;
      this.gridView = true;
    } else if (viewType === 'list') {
      this.gridView = false;
      this.listView = true;
    }
  }

  public clearSearchPrivate(): void {
    this.searchInputPrivate = '';
    //this.filteredPrivate = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    this.refreshPrivate(null, true);
  }

  public clearSearchShared(): void {
    this.searchInputShared = '';
    //this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    this.refreshShared(null, true);
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._sharedLimit += 5;
    //this.filteredPrivate = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    this.refreshPrivate();
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredPrivate.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredPrivate.length - 5), 1000);
      }
    }, 5000);

  }

  public loadMoreShared(args: ListViewEventData): void {
    this._sharedLimit += 10;
    //this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
    this.refreshShared();
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredShared.length > 10) {
        setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 10), 1000);
      }
    }, 5000);
  }

  public openDetails(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(recipe) }
      };
    setTimeout(() => this._router.navigate(['/recipes', recipe.$key], navExtras), 1000);
  }

  public refreshPrivate(args?: ListViewEventData, withFetch?: boolean): void {
    this._privateRecipes = [];
    this._recipeDataSvc.getPrivateRecipes(this._privateLimit, this.searchInputPrivate, withFetch, this.query, this.queryIngredients).subscribe((data: Recipe) => this._privateRecipes.push(data));
    setTimeout(() => {
      this.filteredPrivate = [...this._privateRecipes.slice(0, this._privateLimit)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingPrivate = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public refreshShared(args?: ListViewEventData, withFetch?: boolean): void {
    this._sharedRecipes = [];
    this._recipeDataSvc.getSharedRecipes(this._sharedLimit, this.searchInputShared, withFetch, this.query, this.queryIngredients).subscribe((data: Recipe) => this._sharedRecipes.push(data));
    setTimeout(() => {
      this.filteredShared = [...this._sharedRecipes.slice(0, this._sharedLimit)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingShared = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public searchPrivate(searchTerm: string): void {
    //this.filteredPrivate = [...this._recipeSvc.filterRecipes(this._privateRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._privateLimit)];
    this.searchInputPrivate = searchTerm;
    this.refreshPrivate(null, true);
  }

  public searchShared(searchTerm: string): void {
    //this.filteredShared = [...this._recipeSvc.filterRecipes(this._sharedRecipes, this.query, searchTerm, this.queryIngredients).slice(0, this._sharedLimit)];
    this.searchInputShared = searchTerm;
    this.refreshShared(null, true);
  }

  public showOptions(args: ListViewEventData): void {
    let options = {
      title: 'Recipe options',
      message: 'Choose what to do with your recipe',
      cancelButtonText: 'Cancel',
      actions: ['View details', 'Edit recipe', 'Delete recipe']
    };
    dialogs.action(options).then((result: string) => {
      switch (result) {
        case 'View details':
          this.openDetails(args);
          break;
        case 'Edit recipe':
          this._editRecipe(args);
          break;

        default:
          break;
      }
    });
  }

  public tabIdxChange(tabIdx: number): void {
    if (tabIdx === 1 && this.isLoadingShared) {
      setTimeout(() => this.refreshShared(), 1000);
    }
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    //this.queryIngredients = this._mealSearchSvc.getSelections();
    setTimeout(() => this.refreshPrivate(), 3000);
  }

  ngOnDestroy(): void {
    this._changeDetectionRef.detach();
    this._recipeDataSvc.unsubscribeRecipes();
  }
}