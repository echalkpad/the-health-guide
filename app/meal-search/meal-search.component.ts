// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

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
        private mealSearchSvc: MealSearchService,
        private recipeDataSvc: RecipeDataService,
        private router: RouterExtensions
    ) {  }

    public cancel(): void {
        this.router.back();
    }

    public clearSearch(): void {
        this.searchInputPrivate = '';
        this.filteredMeals = [...this.meals];
    }

    public done(): void {
        this.mealSearchSvc.saveSelections(this.selections);
        this.router.back();
    }

    public loadMoreMeals(args: ListViewEventData): void {
        let that = new WeakRef(this);
        that.get().mealsLimit += 10;
        if (that.get().meals.length > that.get().filteredMeals.length) {
            that.get().filteredMeals.push(...that.get().meals.slice(that.get().filteredMeals.length, that.get().mealsLimit));
            setTimeout(() => {
                args.object.scrollToIndex(that.get().filteredMeals.length - 1);
                args.object.notifyLoadOnDemandFinished();
                args.returnValue = true;
            }, 2000);
        }
    }

    public refreshMeals(args: ListViewEventData): void {
        let that = new WeakRef(this);
        Promise.all<Meal[]>([
            that.get().recipeDataSvc.getSharedRecipes(),
            that.get().foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            that.get().meals = that.get().helpSvc.sortByName([...data[0], data[1]]);
            that.get().filteredMeals = [...that.get().meals];
            args.object.notifyPullToRefreshFinished();
            that.get().changeDetectionRef.markForCheck();
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
        this.selections = [...this.mealSearchSvc.getSelections()];
        Promise.all<Meal[]>([
            this.recipeDataSvc.getSharedRecipes(),
            this.foodSvc.getFoods()
        ]).then((data: Array<Meal[]>) => {
            this.meals = this.helpSvc.sortByName([...data[0], ...data[1]]);
            this.filteredMeals = [...this.meals];
            this.isLoading = false;
            this.changeDetectionRef.markForCheck();
        });
    }
}