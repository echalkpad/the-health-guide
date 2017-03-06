import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Food, FoodGroup } from '../../models';
import { FOOD_GROUPS, FoodService } from '../../providers';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListPage {
  public foods: Array<Food>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public start: number = 0;
  public total: Subject<number>;
  constructor(private _detectorRef: ChangeDetectorRef, private _foodSvc: FoodService) { }

  private _refreshFoods(): void {
    this._foodSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id).subscribe((data: Array<Food>) => {
      this.foods = [...data];
      this._detectorRef.markForCheck();
    });
  }

  public loadMore(ev: InfiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.start += 50;
      this._foodSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id).subscribe((data: Array<Food>) => {
      this.foods.push(...data);
      this._detectorRef.markForCheck();
    });
      ev.complete();
    }, 500);
  }

  ionViewWillEnter() {
    this._refreshFoods();
    this.total = this._foodSvc.totalFoodSubject;
    console.log('Entering...');
  }

  ionViewWillLeave() {
    console.log('Leaving...');
    this._detectorRef.detach();
  }

}
