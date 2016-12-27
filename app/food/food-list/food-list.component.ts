import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

import { DrawerService } from '../../shared';
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  moduleId: module.id,
  selector: 'thg-food',
  templateUrl: 'food-list.component.html',
  styleUrls: ['food-list.component.css']
})
export class FoodListComponent implements OnInit {
  private allFoods: Food[];
  private foodLimit: number = 10;
  public isLoading: boolean = true;
  public partialFoods: Food[];
  constructor(private changeDetectionRef: ChangeDetectorRef, public drawerSvc: DrawerService, private foodSvc: FoodService) { }

  public loadMoreFoods(args: ListViewEventData): void {
    this.foodLimit += 10;
    if (this.allFoods.length > this.partialFoods.length) {
      this.partialFoods.push(...this.allFoods.slice(this.partialFoods.length, this.foodLimit));
      setTimeout(() => {
        args.object.scrollToIndex(this.partialFoods.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public openDetails(args?: ListViewEventData): void {
    console.log(args.object.getSelectedItems());
  }

  public refreshFoods(args?: ListViewEventData): void {
    this.foodSvc.getFood().then((data: Food[]) => {
      this.allFoods = [...data];
      this.partialFoods = this.allFoods.slice(0, this.foodLimit);
      this.isLoading = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
    });
  }

  ngOnInit(): void {
    this.refreshFoods();
  }
}