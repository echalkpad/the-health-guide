import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { AlertController, NavController, ModalController } from 'ionic-angular';

// Models
import { Meal, MealJournal } from '../../../models';

// Pages
import { MjDetailsPage } from './mj-details/mj-details';
import { MealSearchPage } from '../../meal-search/meal-search';

// Providers
import { MealService } from '../../../providers';

@Component({
  templateUrl: 'meal-journal.html'
})
export class MealJournalPage implements OnInit {
  public currentDate: string;
  public editing: boolean = false;
  public mealJournals: FirebaseListObservable<MealJournal[]>;
  public searchBy: string = "date";
  public searchQuery: string;

  constructor(
    private alertCtrl: AlertController,
    private mealSvc: MealService,
    private modalCtrl: ModalController,
    public navCtrl: NavController
  ) { }

  public changeQuantity(meal: Meal): void {
    let quantityAlert = this.alertCtrl.create({
      title: `${meal.name}`,
      message: "Enter quantity",
      inputs: [
        {
          name: 'quantity',
          placeholder: MealService.hasOwnProperty('chef') ? 'Portions' : 'Grams',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Canceled');
          }
        },
        {
          text: 'Save',
          handler: data => {
            meal.amount = +data.quantity;
          }
        }
      ]
    });
    quantityAlert.present();
  }

  public editMj(mealJournal: MealJournal): void {
    console.log(mealJournal);
    if (this.editing) {
      this.updateMj(mealJournal);
    }
    this.editing = !this.editing;
  }

  public openMjDetails(mealJournal: MealJournal): void {
    console.log(mealJournal);
    this.navCtrl.push(MjDetailsPage, { mealJournal });
  }

  public removeMeal(mealJournal: MealJournal, mealTime: string, index: number): void {
    mealJournal[mealTime].meals.splice(index, 1);
  }

  public searchMeal(mealJournal: MealJournal, mealTime: string): void {
    let mealTimeAlert = this.alertCtrl.create({
      title: "Add meal",
      message: "Please select a meal time",
      inputs: [
        {
          value: 'breakfast',
          label: 'Breakfast',
          type: 'radio'
        },
        {
          value: 'brunch',
          label: 'Brunch',
          type: 'radio'
        },
        {
          value: 'lunch',
          label: 'Lunch',
          type: 'radio'
        },
        {
          value: 'snack',
          label: 'Snack',
          type: 'radio'
        },
        {
          value: 'dinner',
          label: 'Dinner',
          type: 'radio'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Canceled');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let mealSearchModal = this.modalCtrl.create(MealSearchPage, {
              meals: [] || mealJournal[data].meals,
              noQuantity: false
            });
            mealSearchModal.onDidDismiss(meals => {
              if (!!meals) {
                mealJournal[data].meals = [...meals];
              }
            });
            mealSearchModal.present();
          }
        }
      ]
    });
    mealTimeAlert.present();
  }

  public updateMj(mealJournal: MealJournal): void {
    console.log(mealJournal);
    mealJournal.date = this.currentDate;
    this.mealSvc.setMjNutrition(mealJournal);
    if (mealJournal.hasOwnProperty('$key')) {
      this.mealSvc.updateMealJournal(mealJournal);
    } else {
      this.mealSvc.addMealJournal(mealJournal);
    }
  }

  ngOnInit(): void {
    let myDate = new Date(),
      currentDay = myDate.getDate(),
      currentMonth = myDate.getMonth() + 1,
      currentYear = myDate.getFullYear();
    this.currentDate = currentYear + '-' + ((currentMonth < 10) ? '0' + currentMonth : currentMonth) + '-' +
      ((currentDay < 10) ? '0' + currentDay : currentDay);
    this.mealJournals = this.mealSvc.getMealJournals();
    this.searchQuery = this.currentDate;
  }

}
