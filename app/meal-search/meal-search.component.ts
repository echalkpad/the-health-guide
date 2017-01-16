// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
        private _params: ModalDialogParams,
        private _recipeDataSvc: RecipeDataService,
        private _router: RouterExtensions
    ) { }

    public cancel(): void {
        this._mealSearchSvc.clearSelections();
        this._params.closeCallback([]);
    }

    public clearSearch(): void {
        this.searchInput = '';
        this.refreshMeals(null, true);
    }

    public done(): void {
        this._params.closeCallback(this.selections);
    }

    public loadMoreMeals(args: ListViewEventData): void {
        this._mealsLimit += 20;
        this.refreshMeals(null, true);
        setTimeout(() => {
            args.object.notifyLoadOnDemandFinished();
            args.returnValue = true;
            if (this.filteredMeals.length > 10) {
                setTimeout(() => args.object.scrollToIndex(this.filteredMeals.length - 10), 1000);
            }
        }, 5000);
    }

    public refreshMeals(args?: ListViewEventData, withFetch?: boolean): void {
        Observable.forkJoin([
            this._foodSvc.getFoods(this._mealsLimit / 2, this.searchInput, withFetch),
            this._recipeDataSvc.getSharedRecipes(this._mealsLimit / 2, this.searchInput, null, null, withFetch)
        ]).subscribe((data: Array<Meal[]>) => {
            this.meals = this._helperSvc.sortByName([...data[0], data[1]]);
            this.filteredMeals = [...this.meals];
            if (args) {
                args.object.notifyPullToRefreshFinished();
            }
            this._changeDetectionRef.detectChanges();
            this._changeDetectionRef.markForCheck();
        });
    }

    public removeSelection(selection: SetupItemViewArgs): void {
        this.selections.splice(selection.index, 1);
    }

    public searchMeals(searchTerm: string): void {
        this.searchInput = searchTerm;
        this.refreshMeals(null, true);
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

    }
}