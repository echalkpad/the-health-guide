// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone, ViewContainerRef } from '@angular/core';
import { NavigationExtras } from '@angular/router';

// Lodash
import * as _ from 'lodash';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { ListViewEventData, RadListView } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';
import { ObservableArray } from 'data/observable-array';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

// THG
import { AuthService } from '../../auth';
import { DrawerService } from '../../shared';
import { MealSearchComponent } from '../../meal-search';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
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
  private _sharedLimit: number = 5;
  private _sharedRecipes: Recipe[];
  public filteredPrivate: ObservableArray<Recipe>;
  public filteredShared: ObservableArray<Recipe>;
  public gridView: boolean = false;
  public ingredients: string[];
  public isLoadingPrivate: boolean = true;
  public isLoadingShared: boolean = true;
  public isSearching: boolean = false;
  public listView: boolean = true;
  public ingredientsQuery: Ingredient[] = [];
  public searchBy: string = 'name';
  public searchQueryPrivate: string = '';
  public searchQueryShared: string = '';
  constructor(
    private _authSvc: AuthService,
    private _detectorRef: ChangeDetectorRef,
    private _modalSvc: ModalDialogService,
    private _recipeDataSvc: RecipeDataService,
    private _recipeSvc: RecipeService,
    private _router: RouterExtensions,
    private _viewRef: ViewContainerRef,
    private _zone: NgZone,
    public drawerSvc: DrawerService
  ) { }

  private _showAlert(title: string, msg: Error | string): void {
    let options: dialogs.AlertOptions = {
      title: title,
      message: msg.toString(),
      okButtonText: 'OK'
    };
    dialogs.alert(options).then(() => {
      console.log('Race chosen!');
    });
  }

  public addRecipe(): void {
    let newRecipe: Recipe = new Recipe(),
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(newRecipe) }
      };
    setTimeout(() => this._router.navigate(['/recipes', '-'], navExtras), 100);
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
          this.searchBy = 'name';
          break;
        case 'Chef':
          this.searchBy = 'chef';
          break;
        case 'Ingredients':
          this.searchBy = 'ingredients';

          let options: ModalDialogOptions = {
            viewContainerRef: this._viewRef,
            context: {
              meals: this.ingredientsQuery
            },
            fullscreen: true
          };

          this._modalSvc.showModal(MealSearchComponent, options)
            .then((ingredients: Ingredient[]) => this.ingredientsQuery = [...ingredients]);

          break;

        default:
          this.searchBy = 'name';
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
    this.searchQueryPrivate = '';
    this.isLoadingPrivate = true;
    this.refreshPrivate();
  }

  public clearSearchShared(): void {
    this.searchQueryShared = '';
    this.isLoadingShared = true;
    this.refreshShared();
  }

  public loadMorePrivate(args: ListViewEventData): void {
    this._privateLimit += 5;
    this.refreshPrivate().then(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredPrivate.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredPrivate.length - 5), 1000);
      }
    });

  }

  public loadMoreShared(args: ListViewEventData): void {
    this._sharedLimit += 5;
    this.refreshShared().then(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredShared.length > 5) {
        setTimeout(() => args.object.scrollToIndex(this.filteredShared.length - 5), 1000);
      }
    });
  }

  public openDetails(args: ListViewEventData): void {
    let listview = args.object as RadListView,
      recipe: Recipe = listview.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { recipe: JSON.stringify(recipe) }
      };
    setTimeout(() => this._router.navigate(['/recipes', recipe.$key], navExtras), 100);
  }

  public refreshPrivate(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._privateRecipes = [];
      this._recipeDataSvc.getPrivateRecipes(this._privateLimit, this.searchQueryPrivate, this.searchBy, this.ingredientsQuery).subscribe((data: Recipe) => {
        let idx: number = _.findIndex(this._privateRecipes, (item: Recipe) => item.$key === data.$key);
        switch (data.$type) {
          case 'ChildAdded':
            if (idx === -1) {
              this._privateRecipes.push(data);
            } else {
              this._privateRecipes[idx] = _.assign({}, data);
            }
            break;
          case 'ChildChanged':
            if (idx !== -1) {
              this._privateRecipes[idx] = _.assign({}, data);
            }
            break;

          case 'ChildRemoved':
            if (idx !== -1) {
              this._privateRecipes.splice(idx, 1);
            }
            break;

          default:
            break;
        }
      });
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredPrivate = new ObservableArray<Recipe>([...this._privateRecipes.slice(0, this._privateLimit)]);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoadingPrivate = false;
        this._detectorRef.markForCheck();
        resolve(true);
      }, 2500);
    });
  }

  public refreshShared(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._sharedRecipes = [];
      this._recipeDataSvc.getSharedRecipes(this._sharedLimit, this.searchQueryShared, this.searchBy, this.ingredientsQuery).subscribe((data: Recipe) => {
        let idx: number = _.findIndex(this._sharedRecipes, (item: Recipe) => item.$key === data.$key);
        switch (data.$type) {
          case 'ChildAdded':
            if (idx === -1) {
              this._sharedRecipes.push(data);
            } else {
              this._sharedRecipes[idx] = _.assign({}, data);
            }
            break;
          case 'ChildChanged':
            if (idx !== -1) {
              this._sharedRecipes[idx] = _.assign({}, data);
            }
            break;

          case 'ChildRemoved':
            if (idx !== -1) {
              this._sharedRecipes.splice(idx, 1);
            }
            break;

          default:
            break;
        }
      });
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredShared = new ObservableArray<Recipe>([...this._sharedRecipes.slice(0, this._sharedLimit)]);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoadingShared = false;
        this._detectorRef.markForCheck();
        resolve(true);
      }, 2500);
    });
  }

  public searchPrivate(searchQuery: string): void {
    this.searchQueryPrivate = searchQuery;
    this.isLoadingPrivate = true;
    this.refreshPrivate();
  }

  public searchShared(searchQuery: string): void {
    this.searchQueryShared = searchQuery;
    this.isLoadingShared = true;
    this.refreshShared();
  }

  public showOptions(args: ListViewEventData): void {
    let selectedRecipe: Recipe = args.object.getSelectedItems()[0],
      options = {
        title: 'Recipe chosen',
        message: 'What to do with this recipe?',
        cancelButtonText: 'Cancel',
        actions: ['View details', 'Edit recipe', 'Remove recipe']
      };
    dialogs.action(options).then((result: string) => {
      switch (result) {
        case 'View details':
          let modalOpts: ModalDialogOptions = {
            context: selectedRecipe,
            viewContainerRef: this._viewRef,
            fullscreen: true
          };
          this._modalSvc.showModal(RecipeDetailComponent, modalOpts);
          break;
        case 'Edit recipe':
          let navExtras: NavigationExtras = {
            queryParams: { recipe: JSON.stringify(selectedRecipe) }
          };
          setTimeout(() => this._router.navigate(['/recipes', selectedRecipe.$key], navExtras), 100);
          break;
        case 'Remove recipe':
          this._recipeDataSvc.removeRecipe(selectedRecipe).then(() => {
            this._showAlert('Success', 'Recipe removed!');
            this.refreshPrivate();
          }).catch((err: Error) => this._showAlert('Ooops, something went wrong!', err));
          this._detectorRef.markForCheck();
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
    this.refreshPrivate();
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
    this._recipeDataSvc.unsubscribeRecipes();
  }
}