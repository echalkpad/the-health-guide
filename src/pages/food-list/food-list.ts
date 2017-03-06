import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';

import { FoodDetailsPage } from '../food-details/food-details';
import { Food, FoodGroup } from '../../models';
import { FOOD_GROUPS, FoodService } from '../../providers';

@Component({
  selector: 'page-food-list',
  templateUrl: 'food-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListPage {
  public detailsPage: any = FoodDetailsPage;
  public foods: Array<Food>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 50;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public start: number;
  constructor(private _detectorRef: ChangeDetectorRef, private _foodSvc: FoodService) { }

  public clearSearch(ev): void {
    this.searchQuery = '';
    this.refreshItems();
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

  public refreshItems(): void {
    this.start = 0;
    this._foodSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id).subscribe((data: Array<Food>) => {
      this.foods = [...data];
      this._detectorRef.markForCheck();
    });
  }

  ionViewWillEnter() {
    this.refreshItems();
    console.log('Entering...');
  }

  ionViewWillLeave() {
    console.log('Leaving...');
    this._detectorRef.detach();
  }

}
