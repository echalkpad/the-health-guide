// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone, ViewContainerRef } from '@angular/core';

// Lodash
import * as _ from 'lodash';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Nativescript
import { setTimeout } from 'timer';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

//THG
import { DrawerService } from '../../shared';
import { Food } from '../shared/food.model';
import { FoodDetailComponent } from '../food-detail/food-detail.component';
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
  private _foodLimit: number = 25;
  public filteredFoods: Observable<Food[]>;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public searchQuery: string = '';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _viewRef: ViewContainerRef,
    private _zone: NgZone,
    public drawerSvc: DrawerService,
  ) { }



  ngOnInit(): void {
    this.filteredFoods = this._foodSvc.getUSDAFoods(this.searchQuery, 0, this._foodLimit);
  }
}

/**
 *   public clearSearch(): void {
    this.searchQuery = '';
    this.isLoading = true;
    this.refreshFoods();
  }

  public loadMoreFoods(args: ListViewEventData): void {
    this._foodLimit += 25;
    this.refreshFoods().then(() => {
      args.object.notifyLoadOnDemandFinished();
      args.returnValue = true;
      if (this.filteredFoods.length > 25) {
        setTimeout(() => args.object.scrollToIndex(this.filteredFoods.length - 25), 1000);
      }
    });
  }

  public openDetails(args?: ListViewEventData): void {
    let selectedFood: Food = args.object.getSelectedItems()[0],
      modalOpts: ModalDialogOptions = {
        context: selectedFood,
        viewContainerRef: this._viewRef,
        fullscreen: true
      };
    this._modalSvc.showModal(FoodDetailComponent, modalOpts);
  }

  public refreshFoods(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._foods = [];
      this._foodSvc.getFoods(this._foodLimit, this.searchQuery).subscribe((data: Food) => this._foods.push(data));
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredFoods = new ObservableArray<Food>([...this._foods.slice(0, this._foodLimit)]);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoading = false;
        this._detectorRef.markForCheck();
        resolve(true);
      }, 2500);
    });
  }

  public searchFood(searchQuery: string): void {
    this.searchQuery = searchQuery;
    this.isLoading = true;
    this.refreshFoods();
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
    this._foodSvc.unsubscribeFoods();
  }
 */