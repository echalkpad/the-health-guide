// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, NgZone, ViewContainerRef } from '@angular/core';

// Lodash
import * as _ from 'lodash';

// Nativescript
import * as dialogs from 'ui/dialogs';
import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';
import { ObservableArray } from 'data/observable-array';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

// THG
import { DrawerService } from '../../shared';
import { Nutrient } from '../shared/nutrient.model';
import { NutrientDetailComponent } from '../nutrient-detail/nutrient-detail.component';
import { NutrientService } from '../shared/nutrient.service';

@Component({
  moduleId: module.id,
  selector: 'thg-nutrients',
  templateUrl: 'nutrient-list.component.html',
  styleUrls: ['nutrient-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientListComponent implements OnDestroy, OnInit {
  private _macronutrients: Nutrient[];
  private _micronutrients: Nutrient[];
  public filteredMacronutrients: ObservableArray<Nutrient>;
  public filteredMicronutrients: ObservableArray<Nutrient>;
  public isLoadingMacros: boolean = true;
  public isLoadingMicros: boolean = true;
  public isSearching: boolean = false;
  public searchBy: string = 'name';
  public searchQueryMacros: string = '';
  public searchQueryMicros: string = '';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _nutrientSvc: NutrientService,
    private _modalSvc: ModalDialogService,
    private _viewRef: ViewContainerRef,
    private _zone: NgZone,
    public drawerSvc: DrawerService
  ) { }

  public changesearchBy(): void {
    dialogs.action({
      title: 'Filter type',
      message: 'Choose the search filter',
      cancelButtonText: 'Cancel',
      actions: ['Name', 'Functions', 'Disease preventions', 'Deficiency', 'Toxicity']
    }).then((result: string) => {
      switch (result) {
        case 'Name':
          this.searchBy = 'name';
          break;
        case 'Functions':
          this.searchBy = 'functions';
          break;
        case 'Disease preventions':
          this.searchBy = 'diseasePrev';
          break;
        case 'Deficiency':
          this.searchBy = 'deficiency';
          break;
        case 'Toxicity':
          this.searchBy = 'toxicity';
          break;

        default:
          this.searchBy = 'name';
          break;
      }
    });
  }

  public clearSearchMacros(): void {
    this.searchQueryMacros = '';
    this.isLoadingMacros = true;
    this.refreshMacros();
  }

  public clearSearchMicros(): void {
    this.searchQueryMicros = '';
    this.isLoadingMicros = true;
    this.refreshMacros();
  }

  public openDetails(args: ListViewEventData, nutrientGroup: string): void {
    let selectedNutrient: Nutrient = args.object.getSelectedItems()[0],
      modalOpts: ModalDialogOptions = {
        context: selectedNutrient,
        viewContainerRef: this._viewRef,
        fullscreen: true
      };
    this._modalSvc.showModal(NutrientDetailComponent, modalOpts);
  }

  public refreshMacros(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._macronutrients = [];
      this._nutrientSvc.getMacronutrients(this.searchBy, this.searchQueryMacros).subscribe((data: Nutrient) => {
        let idx: number = _.findIndex(this._macronutrients, (item: Nutrient) => item.$key === data.$key);
        switch (data.$type) {
          case 'ChildAdded':
            if (idx === -1) {
              this._macronutrients.push(data);
            } else {
              this._macronutrients[idx] = _.assign({}, data);
            }
            break;
          case 'ChildChanged':
            if (idx !== -1) {
              this._macronutrients[idx] = _.assign({}, data);
            }
            break;

          case 'ChildRemoved':
            if (idx !== -1) {
              this._macronutrients.splice(idx, 1);
            }
            break;

          default:
            break;
        }
      });
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredMacronutrients = new ObservableArray<Nutrient>(this._macronutrients);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoadingMacros = false;
        this._detectorRef.markForCheck();
        resolve(true);
      }, 5000);
    });
  }

  public refreshMicros(args?: ListViewEventData): Promise<boolean> {
    this._zone.runOutsideAngular(() => {
      this._micronutrients = [];
      this._nutrientSvc.getMicronutrients(this.searchBy, this.searchQueryMicros).subscribe((data: Nutrient) => {
        let idx: number = _.findIndex(this._micronutrients, (item: Nutrient) => item.$key === data.$key);
        switch (data.$type) {
          case 'ChildAdded':
            if (idx === -1) {
              this._micronutrients.push(data);
            } else {
              this._micronutrients[idx] = _.assign({}, data);
            }
            break;
          case 'ChildChanged':
            if (idx !== -1) {
              this._micronutrients[idx] = _.assign({}, data);
            }
            break;

          case 'ChildRemoved':
            if (idx !== -1) {
              this._micronutrients.splice(idx, 1);
            }
            break;

          default:
            break;
        }
      });
    });
    return new Promise(resolve => {
      setTimeout(() => {
        this.filteredMicronutrients = new ObservableArray<Nutrient>(this._micronutrients);
        if (args) {
          args.object.notifyPullToRefreshFinished();
        }
        this.isLoadingMicros = false;
        this._detectorRef.markForCheck();
        resolve(true);
      }, 5000);
    });
  }

  public searchMacros(searchQuery: string): void {
    this.searchQueryMacros = searchQuery;
    this.isLoadingMacros = true;
    this.refreshMacros();
  }

  public searchMicros(searchQuery: string): void {
    this.searchQueryMicros = searchQuery;
    this.isLoadingMicros = true;
    this.refreshMicros();
  }

  public tabIdxChange(tabIdx): void {
    if (tabIdx === 1 && this.isLoadingMicros) {
      setTimeout(() => this.refreshMicros(), 1000);
    }
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this.refreshMacros();
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
    this._nutrientSvc.unsubscribeNutrients();
  }
}