import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TdDialogService, TdLoadingService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';

import { Auth } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
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
    public auth: Auth;
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
        private authSvc: AuthService,
        private dataSvc: DataService,
        private dialogSvc: TdDialogService,
        private foodSvc: FoodService,
        private helperSvc: HelperService,
        private loadingSvc: TdLoadingService,
        private recipeDataSvc: RecipeDataService,
        private mtDataSvc: MealTrackDataService,
        private mtSvc: MealTrackService,
        private route: ActivatedRoute,
        private router: Router,
        private titleSvc: Title
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

    private showAlert(msg: string | Error, title: string): void {
        this.dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: title,
            closeButton: 'Close'
        });
    }

    public addMealTime(): void {
        let date: Date = new Date();
        this.dialogSvc.openPrompt({
            message: 'Format: hh:mm',
            disableClose: true,
            value: `${date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}`,
            title: 'Enter a time',
        }).afterClosed().subscribe((value: string) => {
            if (value) {
                this.mealTrack.mealTimes.push(new MealTime(value));
                this.isDirty = true;
            }
        });
    }

    public addSelectedMeals(mt: MealTime): void {
        this.isDirty = true;
        mt.meals = [...mt.meals, ...this.selectedMeals];
        mt.nutrition = this.mtSvc.getMealTimeNutrition(mt);
        this.loadingSvc.register('mt-nutrition.load');
        this.mtSvc.setMealTrackNutrition(this.mealTrack).then((nutrition: MealTrackNutrition) => {
            this.mealTrack.nutrition = nutrition;
            this.loadingSvc.resolve('mt-nutrition.load')
        });
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (this.isDirty === false) {
            return true;
        }
        return new Promise(resolve => {
            return this.dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

    public changeDate(): void {
        this.dialogSvc.openPrompt({
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
        this.isDirty = true;
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
        this.isDirty = true;
        this.dialogSvc.openPrompt({
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
                        mt.nutrition = this.mtSvc.getMealTimeNutrition(mt);
                        this.loadingSvc.register('mt-nutrition.load');
                        this.mtSvc.setMealTrackNutrition(this.mealTrack).then((nutrition: MealTrackNutrition) => {
                            this.mealTrack.nutrition = nutrition;
                            this.loadingSvc.resolve('mt-nutrition.load')
                        });
                    }
                }
            }
        });
    }

    public clearAllSelections(): void {
        this.meals = [...this.meals, ...this.selectedMeals];
        this.selectedMeals = [];
        this.filteredMeals = [...this.helperSvc.sortByName(this.meals)];
        this.filter();
        this.isDirty = true;
    }

    public filter(searchTerm: string = ''): void {
        let newData: Meal[] = this.meals;
        newData = this.helperSvc.filterItems(newData, searchTerm);
        this.filteredTotal = newData.length;
        newData = this.helperSvc.paginate(newData, this.startPage, this.currentPage * this.pageSize);
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
        mt.nutrition = this.mtSvc.getMealTimeNutrition(mt);
        this.mtSvc.setMealTrackNutrition(this.mealTrack);
    }

    public removeMealTime(mt: MealTime): void {
        this.isDirty = true;
        this.mealTrack.mealTimes.splice(this.mealTrack.mealTimes.indexOf(mt), 1);
        this.loadingSvc.register('mt-nutrition.load');
        this.mtSvc.setMealTrackNutrition(this.mealTrack).then((nutrition: MealTrackNutrition) => {
            this.mealTrack.nutrition = nutrition;
            this.loadingSvc.resolve('mt-nutrition.load')
        });
    }

    public syncMealTrack(): void {
        if (this.isDirty) {
            this.mtDataSvc.setMealTrack(this.auth.id, this.mealTrack);
            this.dataSvc.saveMealTrack(this.mealTrack);
            this.isDirty = false;
        }
        this.mtDataSvc.getMealTrack(this.auth.id, this.currentDate).subscribe((mt: MealTracker) => {
            if (!!mt && !!mt.hasOwnProperty('date')) {
                this.mealTrack = mt;
                this.dataSvc.saveMealTrack(mt);
            }
        });

    }

    public toggleSelectedMeal(meal: Meal): void {
        this.isDirty = true;
        let idx: number = this.selectedMeals.indexOf(meal);
        if (idx === -1) {
            this.dialogSvc.openPrompt({
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
                        this.selectedMeals.push(meal);
                        this.meals.splice(this.meals.indexOf(meal), 1);
                        this.filteredMeals = [...this.helperSvc.sortByName(this.meals)];
                        this.filter();
                    }
                }
            });
        } else {
            this.selectedMeals.splice(idx, 1);
            this.meals.push(meal);
            this.filteredMeals = [...this.helperSvc.sortByName(this.meals)];
            this.filter();
        }

    }

    ngAfterViewInit(): void {
        this.loadingSvc.register('meals.load');
        this.loadingSvc.register('meal-track.load');
        this.loadingSvc.register('mt-nutrition.load');
        setTimeout(() => {
            this.loadingSvc.resolve('meals.load');
            this.loadingSvc.resolve('mt-nutrition.load');
            this.loadingSvc.resolve('meal-track.load');
            if (!this.mealTrack.mealTimes.length) {
                this.showAlert("You haven't served any meals today. Start adding meals!", "No meals for today");
            }
        }, 10000);
        this.titleSvc.setTitle('Meal tracker');
    }

    ngOnInit(): void {
        let recipes: Meal[] = [], food: Meal[] = [];
        this.auth = Object.assign({}, this.authSvc.getAuthData());
        this.currentDate = this.dataSvc.getCurrentDate();
        this.foodSvc.getFoods().subscribe((data: Meal[]) => {
            if (!!data && !!data.length) {
                food = [...data];
            }
        });

        this.recipeDataSvc.getMyRecipes(this.auth.id).subscribe((data: Meal[]) => {
            if (!!data && !!data.length) {
                recipes = [...data];
            }
        });
        setTimeout(() => {
            this.meals = [...food, ...recipes];
            this.filteredMeals = [...this.meals];
            this.filter();
        }, 10000);

        this.route.data.subscribe((data: { mealTrack: MealTracker }) => {
            this.mealTrack = Object.assign({}, data.mealTrack);
            this.aminoacids = Object.keys(this.mealTrack.nutrition['amino acids']);
            this.vitamins = Object.keys(this.mealTrack.nutrition['vitamins']);
            this.minerals = Object.keys(this.mealTrack.nutrition['minerals']);
        });
    }

}
