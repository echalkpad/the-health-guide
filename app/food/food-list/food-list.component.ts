// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone, ViewContainerRef } from '@angular/core';

// Lodash
import * as _ from 'lodash';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { setTimeout } from 'timer';
import { ObservableArray } from 'data/observable-array';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

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
export class FoodListComponent implements OnDestroy, OnInit {
  private _foods: Food[];
  private _foodLimit: number = 25;
  public filteredFoods: ObservableArray<Food>;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public searchInput: string = '';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _foodSvc: FoodService,
    private _modalSvc: ModalDialogService,
    private _viewRef: ViewContainerRef,
    private _zone: NgZone,
    public drawerSvc: DrawerService,
  ) { }

  public clearSearch(): void {
    this.searchInput = '';
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
      };
    this._modalSvc.showModal(FoodDetailComponent, modalOpts);
  }

  public refreshFoods(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._foods = [];
      this._foodSvc.getFoods(this._foodLimit, this.searchInput).subscribe((data: Food) => {
        let idx: number = _.findIndex(this._foods, (item: Food) => item.$key === data.$key);
        switch (data.$type) {
          case 'ChildAdded':
            if (idx === -1) {
              this._foods.push(data);
            } else {
              this._foods[idx] = _.assign({}, data);
            }
            break;
          case 'ChildChanged':
            if (idx !== -1) {
              this._foods[idx] = _.assign({}, data);
            }
            break;

          case 'ChildRemoved':
            if (idx !== -1) {
              this._foods.splice(idx, 1);
            }
            break;

          default:
            break;
        }
      });
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

  public searchFood(searchTerm: string): void {
    this.searchInput = searchTerm;
    this.isLoading = true;
    this.refreshFoods();
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this.refreshFoods();
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
    this._foodSvc.unsubscribeFoods();
  }
}