// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs/Observable';

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
  public selectedGroup: string = this.groups[0].name;
  public start: number = 0;
  constructor(private _detectorRef: ChangeDetectorRef, private _foodSvc: FoodService) { }

  public changeList(event: IPageChangeEvent): void {

  }

  ngOnInit(): void {
    this.foods = this._foodSvc.getFoods$(this.searchQuery, this.start, this.limit, this.selectedGroup);
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
