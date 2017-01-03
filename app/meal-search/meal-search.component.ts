// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { SetupItemViewArgs } from "nativescript-angular/directives";

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

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
        private __changeDetectionRef: ChangeDetectorRef,
        private _foodSvc: FoodService,
        private __helperSvc: HelperService,
        private _mealSearchSvc: MealSearchService,
        private __recipeDataSvc: RecipeDataService,
        private _router: RouterExtensions
    ) { }

    public cancel(): void {
        this._mealSearchSvc.clearSelections();
        this._router.back();
    }

    public clearSearch(): void {
        this.searchInput = '';
        this.filteredMeals = [...this.meals];
        this.__changeDetectionRef.detectChanges();
        this.__changeDetectionRef.markForCheck();
    }

    public done(): void {
        this._mealSearchSvc.saveSelections(this.selections);
        this._router.back();
    }

    public loadMoreMeals(args: ListViewEventData): void {
        // FIXME: Infinite Loading
        
        this._mealsLimit += 20;
        if (this.meals.length > this.filteredMeals.length) {
            this.filteredMeals.push(...this.meals.slice(this.filteredMeals.length, this._mealsLimit));
            setTimeout(() => {
                args.object.scrollToIndex(this.filteredMeals.length - 1);
                args.object.notifyLoadOnDemandFinished();
                args.returnValue = true;
                this.__changeDetectionRef.detectChanges();
                this.__changeDetectionRef.markForCheck();
            }, 2000);
        }
    }

    public refreshMeals(args: ListViewEventData): void {
        
        Promise.all<Meal[]>([
            this.__recipeDataSvc.getSharedRecipes(),
            this._foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this.__helperSvc.sortByName([...data[0], data[1]]);
            this.filteredMeals = [...this.meals];
            args.object.notifyPullToRefreshFinished();
            this.__changeDetectionRef.detectChanges();
            this.__changeDetectionRef.markForCheck();
        });
    }

    public removeSelection(selection: SetupItemViewArgs): void {
        this.selections.splice(selection.index, 1);
    }

    public searchMeals(searchTerm: string): void {
        this.filteredMeals = this.__helperSvc.filterItems(this.meals, searchTerm).slice(0, this._mealsLimit);
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
        Promise.all<Meal[]>([
            this.__recipeDataSvc.getSharedRecipes(),
            this._foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this.__helperSvc.sortByName([...data[0], ...data[1]]).slice(0, this._mealsLimit);
            this.filteredMeals = [...this.meals];
            this.isLoading = false;
            this.__changeDetectionRef.detectChanges();
            this.__changeDetectionRef.markForCheck();
        });
    }
}