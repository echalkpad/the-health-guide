// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';
import { ObservableArray } from 'data/observable-array';

// THG
import { AuthService } from '../../auth';
import { DrawerService } from '../../shared';
import { MealSearchComponent } from '../../meal-search';
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
  public filteredPrivate: ObservableArray<Recipe>;
  public filteredShared: ObservableArray<Recipe>;
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
    private _modalSvc: ModalDialogService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _route: ActivatedRoute,
    private _router: RouterExtensions,
    private _viewRef: ViewContainerRef,
    private _zone: NgZone,
    public drawerSvc: DrawerService
  ) { }

  private _editRecipe(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(recipe) }
      };
    setTimeout(() => this._router.navigate(['/recipes', this._authSvc.getAuth().id, recipe.$key], navExtras), 100);
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
    this.isLoadingPrivate = true;
    this.refreshPrivate(null, true);
  }

  public clearSearchShared(): void {
    this.searchInputShared = '';
    this.isLoadingShared = true;
    this.refreshShared(null, true);
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._privateLimit += 5;
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
    this._sharedLimit += 5;
    this.refreshShared();
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredShared.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 5), 1000);
      }
    }, 5000);
  }

  public openDetails(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(recipe) }
      };
    setTimeout(() => this._router.navigate(['/recipes', recipe.$key], navExtras), 100);
  }

  public refreshPrivate(args?: ListViewEventData, withFetch?: boolean): void {
    this._zone.runOutsideAngular(() => {
      this._privateRecipes = [];
      this._recipeDataSvc.getPrivateRecipes(this._privateLimit, this.searchInputPrivate, withFetch, this.query, this.queryIngredients).subscribe((data: Recipe) => this._privateRecipes.push(data));
    });
    setTimeout(() => {
      this.filteredPrivate = new ObservableArray<Recipe>(this._privateRecipes);
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingPrivate = false;
      this._changeDetectionRef.markForCheck();
    }, 5000);
  }

  public refreshShared(args?: ListViewEventData, withFetch?: boolean): void {
    this._zone.runOutsideAngular(() => {
      this._sharedRecipes = [];
      this._recipeDataSvc.getSharedRecipes(this._sharedLimit, this.searchInputShared, withFetch, this.query, this.queryIngredients).subscribe((data: Recipe) => this._sharedRecipes.push(data));
    });
    setTimeout(() => {
      this.filteredShared = new ObservableArray<Recipe>(this._sharedRecipes);
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingShared = false;
      this._changeDetectionRef.markForCheck();
    }, 5000);
  }

  public searchPrivate(searchTerm: string): void {
    this.searchInputPrivate = searchTerm;
    this.isLoadingPrivate = true;
    this.refreshPrivate(null, true);
  }

  public searchShared(searchTerm: string): void {
    this.searchInputShared = searchTerm;
    this.isLoadingShared = true;
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
    this._route.queryParams.subscribe((params: Params) => this.refreshPrivate(null, params['refresh']));
  }

  ngOnDestroy(): void {
    this._changeDetectionRef.detach();
    this._recipeDataSvc.unsubscribeRecipes();
  }
}