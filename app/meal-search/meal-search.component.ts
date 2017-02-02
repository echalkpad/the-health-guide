// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';

// Nativescript
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
    private _meals: Meal[];
    private _mealsLimit: number = 10;
    public filteredMeals: Meal[];
    public isLoadingMeals: boolean = true;
    public selections: Meal[];
    public searchInput: string = '';
    constructor(
        private _detectorRef: ChangeDetectorRef,
        private _foodSvc: FoodService,
        private _helperSvc: HelperService,
        private _mealSearchSvc: MealSearchService,
        private _params: ModalDialogParams,
        private _recipeDataSvc: RecipeDataService,
        private _zone: NgZone
    ) { }

    public cancel(): void {
        this._params.closeCallback([]);
    }

    public clearSearch(): void {
        this.searchInput = '';
        this.refreshMeals();
    }

    public done(): void {
        this._params.closeCallback(this.selections);
    }

    public loadMoreMeals(args: ListViewEventData): void {
        this._mealsLimit += 10;
        this.refreshMeals();
        setTimeout(() => {
            args.object.notifyLoadOnDemandFinished();
            args.returnValue = true;
            if (this.filteredMeals.length > 10) {
                setTimeout(() => args.object.scrollToIndex(this.filteredMeals.length - 10), 1000);
            }
        }, 5000);
    }

    public refreshMeals(args?: ListViewEventData, withFetch?: boolean): void {
        this._zone.runOutsideAngular(() => {
            this._meals = [];
            this._mealSearchSvc.getMeals().subscribe((meal: Meal) => this._meals.push(meal));
        });
        setTimeout(() => {
            this.filteredMeals = [...this._meals.slice(0, this._mealsLimit)];
            if (args) {
                args.object.notifyPullToRefreshFinished();
            }
            this.isLoadingMeals = false;
            this._detectorRef.detectChanges();
            this._detectorRef.markForCheck();
        }, 3000);
    }

    public removeSelection(selection: SetupItemViewArgs): void {
        this.selections.splice(selection.index, 1);
    }

    public searchMeals(searchTerm: string): void {
        this.filteredMeals = [...this._helperSvc.filterItems(this._meals, searchTerm).slice(0, this._mealsLimit)];
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
        if (!!this._params.context.meals) {
            this.selections = [...this._params.context.meals];
        }
        setTimeout(() => this.refreshMeals(), 5000);
    }

    ngOnDestroy(): void {
        this._detectorRef.detach();
        this._mealSearchSvc.unsubscribeMeals();
    }
}