// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';

// Nativescript
import { RadListViewComponent } from 'nativescript-telerik-ui/listview/angular';
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
  @ViewChild(RadListViewComponent) private _listView: RadListViewComponent;
  private _foods: Food[];
  private _foodLimit: number = 50;
  public filteredFoods: ObservableArray<Food>;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
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
    this.isLoading = true;
    this.refreshFoods(null, true);
  }

  public get loadMode(): string {
    return (this.filteredFoods.length >= this._foodLimit) ? 'Manual' : 'Auto';
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this._foodLimit += 10;
    this.refreshFoods().then(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredFoods.length > 10) {
        setTimeout(() => args.object.scrollToIndex(this.filteredFoods.length - 10), 1000);
      }
    });
  }

  public openDetails(args?: ListViewEventData): void {
    let selected: Food = args.object.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { food: JSON.stringify(selected) }
      };
    setTimeout(() => this._router.navigate(['/food', selected.$key], navExtras), 100);
  }

  public refreshFoods(args?: ListViewEventData, withFetch?: boolean): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._foods = [];
      this._foodSvc.getFoods(this._foodLimit, this.searchInput, withFetch).subscribe((data: Food) => this._foods.push(data));
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredFoods = new ObservableArray<Food>(this._foods);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoading = false;
        this._changeDetectionRef.markForCheck();
        resolve(true);
      }, 5000);
    });
  }

  public searchFood(searchTerm: string): void {
    this.searchInput = searchTerm;
    this.isLoading = true;
    this.refreshFoods(null, true).then(() => this._listView.listView.notifyLoadOnDemandFinished());
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