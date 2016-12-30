import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import { Router } from '@angular/router';

import * as dialogs from 'ui/dialogs';

import { DataService, DrawerService, HelperService } from '../../shared';
import { Recipe } from '../shared/recipe.model';
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
  private recipeLimit: number = 5;
  private sharedRecipes: Recipe[];
  public filteredPrivate: Recipe[];
  public filteredShared: Recipe[];
  public ingredients: string[];
  public isLoadingPrivate: boolean = true;
  public isLoadingShared: boolean = true;
  public isSearching: boolean = false;
  public query: string = 'name';
  public queryIngredients: string[] = [];
  public searchInputPrivate: string = '';
  public searchInputPublic: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private dataSvc: DataService,
    private helperSvc: HelperService,
    private recipeDataSvc: RecipeDataService,
    private recipeSvc: RecipeService,
    private router: Router,
    public drawerSvc: DrawerService,
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
    this.recipeLimit += 10;
    if (this.privateRecipes.length > this.filteredPrivate.length) {
      this.filteredPrivate.push(...this.privateRecipes.slice(this.filteredPrivate.length, this.recipeLimit));
      setTimeout(() => {
        args.object.scrollToIndex(this.filteredPrivate.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public loadMoreShared(args: ListViewEventData): void {
    this.recipeLimit += 10;
    if (this.sharedRecipes.length > this.filteredShared.length) {
      this.filteredShared.push(...this.sharedRecipes.slice(this.filteredShared.length, this.recipeLimit));
      setTimeout(() => {
        args.object.scrollToIndex(this.filteredShared.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public openDetails(recipe: Recipe): void {
    this.dataSvc.saveRecipe(recipe);
    setTimeout(() => this.router.navigate(['/recipes', recipe['$key']]), 1000);
  }

  public refreshPrivate(args: ListViewEventData): void {
    this.recipeDataSvc.getPrivateRecipes().then((data: Recipe[]) => {
      this.privateRecipes = this.helperSvc.sortByName(data);
      this.filteredPrivate = [...this.privateRecipes];
      this.filteredPrivate = this.filteredPrivate.slice(0, this.recipeLimit);
      this.isLoadingPrivate = false;
      args.object.notifyPullToRefreshFinished();
      this.changeDetectionRef.markForCheck();
    });
  }

  public refreshShared(args: ListViewEventData): void {
    this.recipeDataSvc.getSharedRecipes().then((data: Recipe[]) => {
      this.sharedRecipes = this.helperSvc.sortByName(data);
      this.filteredShared = [...this.privateRecipes];
      this.filteredShared = this.filteredShared.slice(0, this.recipeLimit);
      this.isLoadingShared = false;
      args.object.notifyPullToRefreshFinished();
      this.changeDetectionRef.markForCheck();
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
      this.filteredPrivate = [...this.privateRecipes.slice(0, this.recipeLimit)];
      this.sharedRecipes = [...data[1]];
      this.filteredShared = [...this.privateRecipes.slice(0, this.recipeLimit)];
      this.isLoadingPrivate = false;
      this.isLoadingShared = false;
      this.changeDetectionRef.markForCheck();
    });
  }
}