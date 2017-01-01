// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

// THG
import { FoodService } from '../food';
import { HelperService } from '../shared';
import { Meal } from './meal.model';
import { RecipeDataService } from '../recipes';

@Component({
    moduleId: module.id,
    selector: 'thg-meal-search',
    templateUrl: 'meal-search.component.html',
    styleUrls: ['meal-search.component.css']
})
export class MealSearchComponent implements OnInit {
    private mealsLimit: number = 5;
    public filteredMeals: Meal[];
    public isLoading: boolean = true;
    public selections: Meal[];
    public meals: Meal[];
    public searchInputPrivate: string = '';
    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private foodSvc: FoodService,
        private helpSvc: HelperService,
        private params: ModalDialogParams,
        private recipeDataSvc: RecipeDataService
    ) {
        this.selections = params.context;
    }

    public cancel(): void {
        this.params.closeCallback([]);
    }

    public clearSearch(): void {
        this.searchInputPrivate = '';
        this.filteredMeals = [...this.meals];
    }

    public done(): void {
        this.params.closeCallback(this.selections);
    }

    public loadMore(args: ListViewEventData): void {
        this.mealsLimit += 10;
        if (this.meals.length > this.filteredMeals.length) {
            this.filteredMeals.push(...this.meals.slice(this.filteredMeals.length, this.mealsLimit));
            setTimeout(() => {
                args.object.scrollToIndex(this.filteredMeals.length - 1);
                args.object.notifyLoadOnDemandFinished();
                args.returnValue = true;
            }, 2000);
        }
    }

    public refreshMeals(args: ListViewEventData): void {
        Promise.all<Meal[]>([
            this.recipeDataSvc.getSharedRecipes(),
            this.foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this.helpSvc.sortByName([...data[0], data[1]]);
            this.filteredMeals = [...this.meals];
            args.object.notifyPullToRefreshFinished();
            this.changeDetectionRef.markForCheck();
        });
    }

    public searchMeals(searchTerm: string): void {
        this.filteredMeals = this.meals.filter(
            (meal: Meal) => meal.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1
        ).slice(0, this.mealsLimit);
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
        Promise.all<Meal[]>([
            this.recipeDataSvc.getSharedRecipes(),
            this.foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this.helpSvc.sortByName([...data[0], data[1]]);
            this.filteredMeals = [...this.meals];
            this.isLoading = false;
            this.changeDetectionRef.markForCheck();
        });
    }
}