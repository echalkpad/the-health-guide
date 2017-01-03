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
  private _foods: Food[];
  private _foodLimit: number = 10;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public filteredFoods: Food[];
  public searchInput: string = '';
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _helperSvc: HelperService,
    private _router: RouterExtensions,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.filteredFoods = [...this._foods].slice(0, this._foodLimit);
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this._foodLimit += 10;
    if (this._foods.length > this.filteredFoods.length) {
      this.filteredFoods.push(...this._foods.slice(this.filteredFoods.length, this._foodLimit));
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
      setTimeout(() => args.object.scrollToIndex(this.filteredFoods.length - 10), 1000);
    }
  }

  public openDetails(args?: ListViewEventData): void {
    let selected: Food = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this._foodSvc.storeFood(selected);
    setTimeout(() => this._router.navigate(['/food', selected.$key]), 1000);
  }

  public refreshFoods(args?: ListViewEventData): void {
    this._foodSvc.getFoods().then((data: Food[]) => {
      this._foods = this._helperSvc.sortByName(data);
      this.filteredFoods = [...this._foods].slice(0, this._foodLimit);
      this.isLoading = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public searchFood(searchTerm: string): void {
    this.filteredFoods = this._helperSvc.filterItems(this._foods, searchTerm).slice(0, this._foodLimit);
  }

  ngOnInit(): void {
    this.refreshFoods();
  }
}