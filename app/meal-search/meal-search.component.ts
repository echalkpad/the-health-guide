// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { SetupItemViewArgs } from "nativescript-angular/directives";
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
    private _mealsLimit: number = 20;
    public filteredMeals: Meal[];
    public isLoading: boolean = true;
    public selections: Meal[];
    public meals: Meal[];
    public searchInput: string = '';
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _foodSvc: FoodService,
        private _helperSvc: HelperService,
        private _mealSearchSvc: MealSearchService,
        private _recipeDataSvc: RecipeDataService,
        private _router: RouterExtensions
    ) { }

    public cancel(): void {
        this._mealSearchSvc.clearSelections();
        this._router.back();
    }

    public clearSearch(): void {
        this.searchInput = '';
        this.filteredMeals = [...this.meals];
        this._changeDetectionRef.detectChanges();
        this._changeDetectionRef.markForCheck();
    }

    public done(): void {
        this._mealSearchSvc.saveSelections(this.selections);
        this._router.back();
    }

    public loadMoreMeals(args: ListViewEventData): void {
        this._mealsLimit += 20;
        if (this.meals.length > this.filteredMeals.length) {
            this.filteredMeals.push(...this.meals.slice(this.filteredMeals.length, this._mealsLimit));
            args.object.notifyLoadOnDemandFinished();
            args.returnValue = true;
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
            setTimeout(() => args.object.scrollToIndex(this.filteredMeals.length - 10), 1000);
        }
    }

    public refreshMeals(args: ListViewEventData): void {
        /**
         * Promise.all<Meal[]>([
            this._recipeDataSvc.getSharedRecipes(),
            this._foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this._helperSvc.sortByName([...data[0], data[1]]);
            this.filteredMeals = [...this.meals];
            args.object.notifyPullToRefreshFinished();
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
        });
         */
    }

    public removeSelection(selection: SetupItemViewArgs): void {
        this.selections.splice(selection.index, 1);
    }

    public searchMeals(searchTerm: string): void {
        this.filteredMeals = this._helperSvc.filterItems(this.meals, searchTerm).slice(0, this._mealsLimit);
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
        this.selections = [...this._mealSearchSvc.getSelections()];
        /**
         * Promise.all<Meal[]>([
            this._recipeDataSvc.getSharedRecipes(),
            this._foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this._helperSvc.sortByName([...data[0], ...data[1]]);
            this.filteredMeals = [...this.meals.slice(0, this._mealsLimit)];
            this.isLoading = false;
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
        });
         */
    }
}