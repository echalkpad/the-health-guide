// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { NavigationExtras } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { setTimeout } from 'timer';
import { ObservableArray } from 'data/observable-array';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

//THG
import { DrawerService } from '../../shared';
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
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public foods: ObservableArray<Food>;
  public searchInput: string = '';
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _router: RouterExtensions,
    private _zone: NgZone,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
    this.refreshFoods(true);
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this._foodLimit += 10;
    this.refreshFoods(true);
    setTimeout(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
    }, 5000);
  }

  public openDetails(args?: ListViewEventData): void {
    let selected: Food = args.object.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { food: JSON.stringify(selected) }
      };
    setTimeout(() => this._router.navigate(['/food', selected.$key], navExtras), 100);
  }

  public refreshFoods(withFetch?: boolean): void {
    if (withFetch) {
      this.isLoading = true;
    }
    this._zone.runOutsideAngular(() => {
      this.foods = new ObservableArray<Food>([]);
      this._foodSvc.getFoods(this._foodLimit, this.searchInput, withFetch).subscribe((data: Food) => this.foods.push(data));
    });
    setTimeout(() => {
      this.isLoading = false;
      this._changeDetectionRef.markForCheck();
    }, 5000);
  }

  public searchFood(searchTerm: string): void {
    this.searchInput = searchTerm;
    this.refreshFoods(true);
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this.refreshFoods();
  }

  ngOnDestroy(): void {
    this._changeDetectionRef.detach();
    this._foodSvc.unsubscribeFoods();
  }
}