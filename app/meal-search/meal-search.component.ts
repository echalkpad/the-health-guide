// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

// RxJs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { SetupItemViewArgs } from 'nativescript-angular/directives';
import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';

// THG
import { FoodService } from '../food';
import { HelperService } from '../shared';
import { Meal } from './meal.model';
import { MealSearchService } from './meal-search.service';
import { RecipeDataService } from '../recipes';

@Component({
    moduleId: module.id,
    selector: 'thg-meal-search',
    templateUrl: 'meal-search.component.html',
    styleUrls: ['meal-search.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MealSearchComponent implements OnInit {
    private _foods: Meal[];
    private _foodsLimit: number = 10;
    private _recipes: Meal[];
    private _recipesLimit: number = 10;
    public filteredFoods: Meal[];
    public filteredRecipes: Meal[];
    public isLoadingFoods: boolean = true;
    public isLoadingRecipes: boolean = true;
    public selections: Meal[];
    public searchInputFoods: string = '';
    public searchInputRecipes: string = '';
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _foodSvc: FoodService,
        private _helperSvc: HelperService,
        private _mealSearchSvc: MealSearchService,
        private _params: ModalDialogParams,
        private _recipeDataSvc: RecipeDataService,
        private _route: ActivatedRoute,
        private _router: RouterExtensions
    ) { }

    public cancel(): void {
        //this._params.closeCallback([]);
        this._mealSearchSvc.clearSelections();
        this._router.back();
    }

    public clearSearchFoods(): void {
        this.searchInputFoods = '';
        this.refreshFoods(null, true);
    }

    public clearSearchRecipes(): void {
        this.searchInputRecipes = '';
        this.refreshRecipes(null, true);
    }

    public done(): void {
        //this._params.closeCallback(this.selections);
        this._mealSearchSvc.saveSelections(this.selections);
        this._router.back();
    }

    public loadMoreFoods(args: ListViewEventData): void {
        this._foodsLimit += 10;
        this.refreshFoods(null, true);
        setTimeout(() => {
            args.object.notifyLoadOnDemandFinished();
            args.returnValue = true;
            if (this.filteredFoods.length > 10) {
                setTimeout(() => args.object.scrollToIndex(this.filteredFoods.length - 10), 1000);
            }
        }, 5000);
    }

    public loadMoreRecipes(args: ListViewEventData): void {
        this._recipesLimit += 10;
        this.refreshRecipes(null, true);
        setTimeout(() => {
            args.object.notifyLoadOnDemandFinished();
            args.returnValue = true;
            if (this.filteredRecipes.length > 10) {
                setTimeout(() => args.object.scrollToIndex(this.filteredRecipes.length - 10), 1000);
            }
        }, 5000);
    }

    public refreshFoods(args?: ListViewEventData, withFetch?: boolean): void {
        this._foods = [];
        this._foodSvc.getFoods(this._foodsLimit, this.searchInputFoods, withFetch).subscribe((data: Meal) => this._foods.push(data));
        setTimeout(() => {
            this.filteredFoods = [...this._foods.slice(0, this._foodsLimit)];
            if (args) {
                args.object.notifyPullToRefreshFinished();
            }
            this.isLoadingFoods = false;
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
        }, 3000);
    }

    public refreshRecipes(args?: ListViewEventData, withFetch?: boolean): void {
        this._recipes = [];
        this._recipeDataSvc.getSharedRecipes(this._recipesLimit, this.searchInputRecipes, withFetch).subscribe((data: Meal) => this._recipes.push(data));
        setTimeout(() => {
            this.filteredRecipes = [...this._recipes.slice(0, this._recipesLimit)];
            if (args) {
                args.object.notifyPullToRefreshFinished();
            }
            this.isLoadingRecipes = false;
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
        }, 3000);
    }

    public removeSelection(selection: SetupItemViewArgs): void {
        this.selections.splice(selection.index, 1);
    }

    public searchFoods(searchTerm: string): void {
        this.searchInputFoods = searchTerm;
        this.refreshFoods(null, true);
    }

    public searchRecipes(searchTerm: string): void {
        this.searchInputRecipes = searchTerm;
        this.refreshRecipes(null, true);
    }

    public tabIdxChange(tabIdx: number): void {
        if (tabIdx === 2 && this.isLoadingRecipes) {
            this.refreshRecipes()
        }
    }

    public toggleSelection(args: ListViewEventData): void {
        let selected: Meal = args.object.getSelectedItems()[0];
        if (!!selected['isSelected']) {
            this.selections.splice(this.selections.indexOf(selected, 1));
            selected['isSelected'] = false;
        } else {
            this.selections.push(selected);
            selected['isSelected'] = true;
        }
    }

    ngOnInit(): void {
        /*
        if (!!this._params.context.meals) {
            this.selections = [...this._params.context.meals];
        }
        */
        this._route.queryParams.subscribe((params: Params) => {
            this.selections = JSON.parse(params['meals']);
        });
        this.refreshFoods();
    }

    ngOnDestroy(): void {
        this._changeDetectionRef.detach();
        this._foodSvc.unsubscribeFoods();
        this._recipeDataSvc.unsubscribeRecipes();
    }
}