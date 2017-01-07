// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

//THG
import { DrawerService, HelperService } from '../../shared';
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  moduleId: module.id,
  selector: 'thg-food',
  templateUrl: 'food-list.component.html',
  styleUrls: ['food-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListComponent implements OnDestroy, OnInit {
  private _foodLimit: number = 10;
  public foods: Food[];
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public searchInput: string = '';
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private foodsvc: FoodService,
    private _helperSvc: HelperService,
    private _router: RouterExtensions,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.foodsvc.unsubscribeFoods();
    this.refreshFoods();
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this._foodLimit += 10;
    this.refreshFoods();
    args.object.notifyLoadOnDemandFinished();
    args.returnValue = true;
    this._changeDetectionRef.detectChanges();
    this._changeDetectionRef.markForCheck();
    setTimeout(() => args.object.scrollToIndex(0 || this.foods.length - 5), 3000);
  }

  public openDetails(args?: ListViewEventData): void {
    let selected: Food = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this.foodsvc.storeFood(selected);
    setTimeout(() => this._router.navigate(['/food', selected.$key]), 1000);
  }

  public refreshFoods(args?: ListViewEventData): void {
    this.foods = [];
    this.foodsvc.getFoods(this.searchInput).subscribe((data: firebase.FBData) => {
      if (this.foods.length < this._foodLimit && data.value.name.toLocaleLowerCase().indexOf(this.searchInput.toLocaleLowerCase()) !== -1) {
        let newFood: Food = data.value;
        newFood.$key = data.key;
        this.foods.push(newFood);
      } else {
        this.foods.forEach((food: Food, idx: number) => {
          if (food.$key === data.key) {
            let newFood: Food = data.value;
            newFood.$key = data.key;
            this.foods[idx] = newFood;
          }
        });
      }
      this.isLoading = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public searchFood(searchTerm: string): void {
    this.searchInput = searchTerm;
    this.foodsvc.unsubscribeFoods();
    this.refreshFoods();
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this.foodsvc.keepOnSyncFoods();
    this.refreshFoods();
  }

  ngOnDestroy(): void {
    this.foodsvc.unsubscribeFoods();
  }
}