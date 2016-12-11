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
  public currentPage: number = 1
  public filteredMeals: Meal[] = [];
  public filteredTotal: number = 0;
  public mealData: Object[];
  public meals: Meal[] = [];
  public mealTrack: MealTracker = new MealTracker();
  public minerals: string[] = [];
  public pageSize: number = 10;
  public searchMeals: boolean = true;
  public selectedAvailableMeals: Meal[] = [];
  public startPage: number = 1;
  public showNutrition: boolean = false;
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
      { name: 'Saturated fat', label: 'Saturated fat (g)', numeric: true }
    ];
  }

  private showAlert(msg: string | Error): void {
    this.dialogSvc.openAlert({
      message: msg.toString(),
      disableClose: false,
      title: 'An error has occured',
      closeButton: 'Close'
    });
  }

  private toggleMeal(meal: Meal, meals: Meal[], notMealTime: boolean): void {
    let idx: number = meals.indexOf(meal);
    if (idx === -1) {
      meals.push(meal);
      if (notMealTime) {
        this.meals.splice(this.meals.indexOf(meal), 1);
        this.meals = [...this.helperSvc.sortByName(this.meals)];
        this.filter();
      }
    } else {
      meals.splice(idx, 1);
      if (notMealTime) {
        this.meals.push(meal);
        this.meals = [...this.helperSvc.sortByName(this.meals)];
        this.filter();
      }
    }
  }

  public addMealTime(): void {
    let date: Date = new Date();
    this.dialogSvc.openPrompt({
      message: 'Format: hh:mm',
      disableClose: true,
      value: date.getHours() + ":" + date.getMinutes(),
      title: 'Enter a time',
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        this.mealTrack.mealTimes.push(new MealTime(value));
      }
    });
  }

  public addSelectedMeals(mt: MealTime): void {
    mt.meals = [...mt.meals, ...this.selectedAvailableMeals];
    mt.nutrition = this.mtSvc.getMealTimeNutrition(mt);
    this.mtSvc.setRemainingNutrition(this.mealTrack);
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

  public changeQty(meal: Meal, meals: Meal[], toggle: boolean, mt?: MealTime): void {
    if (toggle) {
      this.toggleMeal(meal, meals, mt ? false : true);
    }
    let idx: number = meals.indexOf(meal);
    if (idx !== -1) {
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
              this.mtSvc.setRemainingNutrition(this.mealTrack);
            }
          }
        }
      });
    }
  }

  private filter(searchTerm: string = ''): void {
    let newData: any[] = this.meals;
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
    mt.meals.splice(mt.meals.indexOf(meal), 1);
    mt.nutrition = this.mtSvc.getMealTimeNutrition(mt);
    this.mtSvc.setRemainingNutrition(this.mealTrack);

  }

  public syncMealTrack(): void {
    this.mtDataSvc.setMealTrack(this.auth.id, this.mealTrack);
    this.dataSvc.saveMealTrack(this.mealTrack);
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('meals.load');
    setTimeout(() => this.loadingSvc.resolve('meals.load'), 4000);
    this.titleSvc.setTitle('Fitness');
  }

  ngOnInit(): void {
    this.auth = Object.assign({}, this.authSvc.getAuthData());
    this.currentDate = this.dataSvc.getCurrentDate();
    this.foodSvc.getFoods().subscribe((data: Meal[]) => {
      if (!!data && !!data.length) {
        this.meals = [...this.meals, ...data];
        this.filteredMeals = [...this.filteredMeals, ...data];
        this.filter();
      }
    });

    this.recipeDataSvc.getMyRecipes(this.auth.id).subscribe((data: Meal[]) => {
      if (!!data && !!data.length) {
        this.meals = [...this.meals, ...data];
        this.filteredMeals = [...this.filteredMeals, ...data];
        this.filter();
      }
    });

    this.route.data.subscribe((data: { mealTrack: MealTracker }) => {
      this.mealTrack = Object.assign({}, data.mealTrack);
      this.aminoacids = Object.keys(this.mealTrack.nutrition['amino acids']);
      this.vitamins = Object.keys(this.mealTrack.nutrition['vitamins']);
      this.minerals = Object.keys(this.mealTrack.nutrition['minerals']);
    });
  }

}
