// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

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
export class FoodListComponent implements OnInit {
  private foods: Food[];
  private foodLimit: number = 10;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public filteredFoods: Food[];
  public searchInput: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private foodSvc: FoodService,
    private helperSvc: HelperService,
    private router: RouterExtensions,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.filteredFoods = [...this.foods].slice(0, this.foodLimit);
  }

  public loadMoreFoods(args: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().foodLimit += 10;
    if (that.get().foods.length > that.get().filteredFoods.length) {
      that.get().filteredFoods.push(...that.get().foods.slice(that.get().filteredFoods.length, that.get().foodLimit));
      setTimeout(() => {
        args.object.scrollToIndex(that.get().filteredFoods.length - 1);
        args.object.notifyLoadOnDemandFinished();
        args.returnValue = true;
      }, 2000);
    }
  }

  public openDetails(args?: ListViewEventData): void {
    let selected: Food = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this.foodSvc.storeFood(selected);
    setTimeout(() => this.router.navigate(['/food', selected.$key]), 1000);
  }

  public refreshFoods(args?: ListViewEventData): void {
    let that = new WeakRef(this);
    that.get().foodSvc.getFoods().then((data: Food[]) => {
      that.get().foods = that.get().helperSvc.sortByName(data);
      that.get().filteredFoods = [...that.get().foods].slice(0, that.get().foodLimit);
      that.get().isLoading = false;
      setTimeout(() => {
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        that.get().changeDetectionRef.markForCheck();
      }, 2000);
    });
  }

  public searchFood(searchTerm: string): void {
    this.filteredFoods = this.helperSvc.filterItems(this.foods, searchTerm).slice(0, this.foodLimit);
  }

  ngOnInit(): void {
    this.refreshFoods();
  }
}