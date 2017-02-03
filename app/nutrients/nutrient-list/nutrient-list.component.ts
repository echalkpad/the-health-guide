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
    this.filteredMacronutrients = new ObservableArray<Nutrient>(this._macronutrients);
  }

  public clearSearchMicros(): void {
    this.searchQueryMicros = '';
    this.filteredMicronutrients = new ObservableArray<Nutrient>(this._micronutrients);
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
      this._nutrientSvc.getMacronutrients().subscribe((data: Nutrient) => this._macronutrients.push(data));
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
      this._nutrientSvc.getMicronutrients().subscribe((data: Nutrient) => this._micronutrients.push(data));
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
    this.filteredMacronutrients = new ObservableArray<Nutrient>(this._nutrientSvc.filterNutrients(this._macronutrients, this.searchBy, this.searchQueryMacros));
  }

  public searchMicros(searchQuery: string): void {
    this.searchQueryMicros = searchQuery;
    this.filteredMicronutrients = new ObservableArray<Nutrient>(this._nutrientSvc.filterNutrients(this._micronutrients, this.searchBy, this.searchQueryMicros));
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