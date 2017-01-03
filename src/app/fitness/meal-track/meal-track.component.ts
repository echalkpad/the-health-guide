import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TdDialogService, TdLoadingService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';

import { DataService } from '../shared/data.service';
import { FoodService } from '../../nutrition/food/shared/food.service';
import { HelperService } from '../../shared/helper.service';
import { Meal, MealTime, MealTracker, MealTrackNutrition } from './meal-tracker.model';
import { MealTrackDataService } from './meal-track-data.service';
import { MealTrackService } from './meal-track.service';
import { RecipeDataService } from '../../nutrition/recipes/shared/recipe-data.service';

@Component({
    selector: 'app-meal-track',
    templateUrl: './meal-track.component.html',
    styleUrls: ['./meal-track.component.scss']
})
export class MealTrackComponent implements AfterViewInit, OnInit {
    public aminoacids: string[] = [];
    public basicNutrients: string[] = [];
    public currentDate: string = "";
    public currentPage: number = 1;
    public isDirty: boolean = false;
    public filteredMeals: Meal[] = [];
    public filteredTotal: number = 0;
    public mealData: Object[];
    public meals: Meal[] = [];
    public mealTrack: MealTracker = new MealTracker();
    public minerals: string[] = [];
    public pageSize: number = 10;
    public selectedMeals: Meal[] = [];
    public startPage: number = 1;
    public vitamins: string[] = [];

    constructor(
        private _dataSvc: DataService,
        private _dialogSvc: TdDialogService,
        private _foodSvc: FoodService,
        private _helperSvc: HelperService,
        private _loadingSvc: TdLoadingService,
        private _recipeDataSvc: RecipeDataService,
        private _mtDataSvc: MealTrackDataService,
        private _mtSvc: MealTrackService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _titleSvc: Title
    ) {

        this.basicNutrients = [
            "Water",
            "Protein",
            "Carbohydrates",
            "Sugars",
            "Fiber",
            "Fats",
            "Saturated fat",
            "Monounsaturated fat",
            "Polyunsaturated fat",
            "Omega-3 fatty acids",
            "Omega-6 fatty acids",
            "Trans fat"
        ];

        this.mealData = [
            { name: 'name', label: 'Food', numeric: false },
            { name: 'quantity', label: 'Quantity (g)', numeric: true },
            { name: 'Energy', label: 'Energy (kcal)', numeric: true },
            { name: 'Protein', label: 'Protein (g)', numeric: true },
            { name: 'Carbohydrates', label: 'Carbs (g)', numeric: true },
            { name: 'Sugars', label: 'Sugars (g)', numeric: true },
            { name: 'Fiber', label: 'Fiber (g)', numeric: true },
            { name: 'Fats', label: 'Fat (g)', numeric: true },
            { name: 'Saturated fat', label: 'Saturated fat (g)', numeric: true },
            { name: 'Omega-3 fatty acids', label: 'Omega-3 (g)', numeric: true },
            { name: 'Omega-6 fatty acids', label: 'Omega-6 (g)', numeric: true }
        ];
    }

    private _showAlert(msg: string | Error, title: string): void {
        this._dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: title,
            closeButton: 'Close'
        });
    }

    public addMealTime(): void {
        let date: Date = new Date();
        this._dialogSvc.openPrompt({
            message: 'Format: hh:mm',
            disableClose: true,
            value: `${date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}`,
            title: 'Enter a time',
        }).afterClosed().subscribe((value: string) => {
            if (value) {
                this.mealTrack.mealTimes.push(new MealTime(value));

            }
        });
    }

    public addSelectedMeals(mt: MealTime): void {
        this.isDirty = true;
        mt.meals = [...mt.meals, ...this.selectedMeals.map((meal: Meal) => Object.assign({}, meal))];
        mt.nutrition = this._mtSvc.getMealTimeNutrition(mt);
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (this.isDirty === false) {
            return true;
        }
        return new Promise(resolve => {
            return this._dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

    public changeDate(): void {
        this._dialogSvc.openPrompt({
            message: 'Format: dd/MM/YYYY',
            disableClose: true,
            value: this.currentDate,
            title: 'Enter a date',
        }).afterClosed().subscribe((value: string) => {
            if (value) {
                this.currentDate = value;
                this.syncMealTrack();
            }
        });
    }

    public changeMealData(meal: Meal, prop: string): number | string {
        let newData: number | string;
        if (meal.hasOwnProperty(prop)) {
            if (typeof meal[prop] === 'number' && prop !== 'quantity') {
                newData = Math.floor(meal[prop] * meal.quantity / 100);
            } else if (prop === 'quantity' && meal.hasOwnProperty('nutrition')) {
                newData = Math.floor(meal[prop] * meal.amount);
            } else {
                newData = meal[prop]
            }
        } else if (meal.nutrition.hasOwnProperty(prop)) {
            newData = Math.floor(meal.nutrition[prop] * meal.amount);
        }
        return newData;
    }

    public changeQty(meal: Meal, mt?: MealTime): void {
        this._dialogSvc.openPrompt({
            message: `Enter the meal quantity in ${meal.hasOwnProperty('nutrition') ? 'units' : 'grams'}`,
            disableClose: true,
            value: `${meal.hasOwnProperty('nutrition') ? '1' : '100'}`,
            title: `Enter ${meal.name}'s quantity`,
        }).afterClosed().subscribe((value: string) => {
            if (value) {
                if (typeof +value === 'number') {
                    if (meal.hasOwnProperty('nutrition')) {
                        meal.amount = +value;
                    } else {
                        meal.amount = +value / 100;
                        meal.quantity = +value;
                    }
                    if (mt) {
                        mt.nutrition = this._mtSvc.getMealTimeNutrition(mt);
                    }
                    this.isDirty = true;
                }
            }
        });
    }

    public clearAllSelections(): void {
        this.meals = [...this.meals, ...this.selectedMeals];
        this.selectedMeals = [];
        this.filteredMeals = [...this._helperSvc.sortByName(this.meals)];
        this.filter();
        this.isDirty = true;
    }

    public filter(searchTerm: string = ''): void {
        let newData: Meal[] = this.meals;
        newData = this._helperSvc.filterItems(newData, searchTerm);
        this.filteredTotal = newData.length;
        newData = this._helperSvc.paginate(newData, this.startPage, this.currentPage * this.pageSize);
        this.filteredMeals = newData;
    }

    public page(pagingEvent: IPageChangeEvent): void {
        this.startPage = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    public removeMeal(meal: Meal, mt: MealTime): void {
        this.isDirty = true;
        mt.meals.splice(mt.meals.indexOf(meal), 1);
        mt.nutrition = this._mtSvc.getMealTimeNutrition(mt);
    }

    public removeMealTime(mt: MealTime): void {
        this.isDirty = true;
        this.mealTrack.mealTimes.splice(this.mealTrack.mealTimes.indexOf(mt), 1);
    }

    public syncMealTrack(): void {
        this._loadingSvc.register('mt-nutrition.load');
        this._mtSvc.setMealTrackNutrition(this.mealTrack).then((nutrition: MealTrackNutrition) => {
            this.mealTrack.nutrition = nutrition;
            if (this.isDirty) {
                this._mtDataSvc.setMealTrack(this.mealTrack);
                this._dataSvc.saveMealTrack(this.mealTrack);
            }
            this._loadingSvc.resolve('mt-nutrition.load')
        });
        setTimeout(() => {
            this._mtDataSvc.getMealTrack(this.currentDate).subscribe((mt: MealTracker) => {
                if (!!mt && !!mt.hasOwnProperty('date')) {
                    this.mealTrack = new MealTracker(this.currentDate);
                    this.mealTrack = mt;
                }
            });
        }, 2000);
        this.isDirty = false;
    }

    public toggleSelectedMeal(meal: Meal, checkBox?: HTMLInputElement): void {
        let idx: number = this.selectedMeals.indexOf(meal);
        if (idx === -1) {
            this._dialogSvc.openPrompt({
                message: `Enter the meal quantity in ${meal.hasOwnProperty('nutrition') ? 'units' : 'grams'}`,
                disableClose: true,
                value: `${meal.hasOwnProperty('nutrition') ? '1' : '100'}`,
                title: `Enter ${meal.name}'s quantity`,
            }).afterClosed().subscribe((value: string) => {
                if (value) {
                    if (typeof +value === 'number') {
                        if (meal.hasOwnProperty('nutrition')) {
                            meal.amount = +value;
                        } else {
                            meal.amount = +value / 100;
                            meal.quantity = +value;
                        }
                        if (checkBox) {
                            checkBox.checked = true;
                        }
                        this.selectedMeals.push(meal);
                        this.meals.splice(this.meals.indexOf(meal), 1);
                        this.filteredMeals = [...this._helperSvc.sortByName(this.meals)];
                        this.filter();
                        this.isDirty = true;
                    }
                } else {
                    if (checkBox) {
                        checkBox.checked = false;
                    }
                }
            });
        } else {
            this.selectedMeals.splice(idx, 1);
            this.meals.push(meal);
            this.filteredMeals = [...this._helperSvc.sortByName(this.meals)];
            this.filter();
            this.isDirty = true;
        }

    }

    ngAfterViewInit(): void {
        this._loadingSvc.register('meals.load');
        this._loadingSvc.register('meal-track.load');
        this._loadingSvc.register('mt-nutrition.load');
        setTimeout(() => {
            this._loadingSvc.resolve('meals.load');
            this._loadingSvc.resolve('mt-nutrition.load');
            this._loadingSvc.resolve('meal-track.load');
            if (!this.mealTrack.mealTimes.length) {
                this._showAlert("You haven't served any meals today. Start adding meals!", "No meals for today");
            }
        }, 10000);
        this._titleSvc.setTitle('Meal tracker');
    }

    ngOnInit(): void {
        let recipes: Meal[] = [], food: Meal[] = [];
        this.currentDate = this._dataSvc.getCurrentDate();
        this._foodSvc.getFoods().subscribe((data: Meal[]) => {
            if (!!data && !!data.length) {
                food = [...data];
            }
        });

        this._recipeDataSvc.getPrivateRecipes().subscribe((data: Meal[]) => {
            if (!!data && !!data.length) {
                recipes = [...data];
            }
        });
        setTimeout(() => {
            this.meals = [...food, ...recipes];
            this.filteredMeals = [...this.meals];
            this.filter();
        }, 10000);

        this._route.data.subscribe((data: { mealTrack: MealTracker }) => {
            this.mealTrack = Object.assign({}, data.mealTrack);
            this.aminoacids = Object.keys(this.mealTrack.nutrition['amino acids']);
            this.vitamins = Object.keys(this.mealTrack.nutrition['vitamins']);
            this.minerals = Object.keys(this.mealTrack.nutrition['minerals']);
        });
    }

}
