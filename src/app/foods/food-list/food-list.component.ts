// Angular
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Covalent
import { IPageChangeEvent } from '@covalent/core';

// THG
import { Food, FoodGroup, FOOD_GROUPS, FoodService } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-food-list',
  templateUrl: 'food-list.component.html',
  styleUrls: ['food-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListComponent implements OnDestroy, OnInit {
  public foods: Observable<Array<Food>>;
  public groups: Array<FoodGroup> = [...FOOD_GROUPS];
  public limit: number = 100;
  public searchQuery: string = '';
  public selectedGroup: FoodGroup = this.groups[0];
  public start: number = 0;
  public total: Subject<number>;
  constructor(private _detectorRef: ChangeDetectorRef, private _foodSvc: FoodService) { }

  public changeList(event: IPageChangeEvent): void {
    this.start = event.fromRow;
    this.limit = event.pageSize;
    this._refreshFoods();
  }

  public changeGroup(group: FoodGroup): void {
    this.selectedGroup = group;
    this._refreshFoods();
  }

  private _refreshFoods(): void {
    this.foods = this._foodSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup.id);
  }

  ngOnInit(): void {
    this._refreshFoods();
    this.total = this._foodSvc.totalFoodSubject;
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
