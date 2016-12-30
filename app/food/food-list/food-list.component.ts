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
  private foods: Food[];
  private foodLimit: number = 10;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public filteredFoods: Food[];
  public searchInput: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private dataSvc: DataService,
    private foodSvc: FoodService,
    private helperSvc: HelperService,
    private router: Router,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.filteredFoods = [...this.foods].slice(0, this.foodLimit);
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this.foodLimit += 10;
    if (this.foods.length > this.filteredFoods.length) {
      this.filteredFoods.push(...this.foods.slice(this.filteredFoods.length, this.foodLimit));
      setTimeout(() => {
        args.object.scrollToIndex(this.filteredFoods.length - 1);
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
      this.foods = this.helperSvc.sortByName(data);
      this.filteredFoods = [...this.foods].slice(0, this.foodLimit);
      this.isLoading = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.changeDetectionRef.markForCheck();
    });
  }

  public searchFood(searchTerm: string): void {
    this.filteredFoods = this.helperSvc.filterItems(this.foods, searchTerm).slice(0, this.foodLimit);
  }

  ngOnInit(): void {
    this.refreshFoods();
  }
}