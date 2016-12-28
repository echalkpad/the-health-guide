import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { ListViewEventData } from 'nativescript-telerik-ui/listview';

import { DataService, DrawerService, HelperService } from '../../shared';
import { Food } from '../shared/food.model';
import { FoodService } from '../shared/food.service';

@Component({
  moduleId: module.id,
  selector: 'thg-food',
  templateUrl: 'food-list.component.html',
  styleUrls: ['food-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListComponent implements OnInit {
  private allFoods: Food[];
  private filteredFoods: Food[];
  private foodLimit: number = 10;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public partialFoods: Food[];
  public searchInput: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private dataSvc: DataService,
    public drawerSvc: DrawerService,
    private foodSvc: FoodService,
    private helperSvc: HelperService,
    private router: Router
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.filteredFoods = [...this.allFoods];
    this.partialFoods = this.filteredFoods.slice(0, this.foodLimit);
  }

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
    let selected: Food = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this.dataSvc.saveFood(selected);
    setTimeout(() => this.router.navigate(['/food', selected.$key]), 1000);
  }

  public refreshFoods(args?: ListViewEventData): void {
    this.foodSvc.getFood().then((data: Food[]) => {
      this.allFoods = this.helperSvc.sortByName(data);
      this.filteredFoods = [...this.allFoods];
      this.partialFoods = this.filteredFoods.slice(0, this.foodLimit);
      this.isLoading = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.changeDetectionRef.markForCheck();
    });
  }

  public searchFood(searchTerm: string): void {
    this.filteredFoods = this.helperSvc.filterItems(this.allFoods, searchTerm);
    this.partialFoods = this.filteredFoods.slice(0, this.foodLimit);
  }

  ngOnInit(): void {
    this.refreshFoods();
  }
}