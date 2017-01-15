// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import { setTimeout } from 'timer';

// THG
import { DrawerService, HelperService } from '../../shared';
import { Nutrient } from '../shared/nutrient.model';
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
  public filteredMacronutrients: Nutrient[];
  public filteredMicronutrients: Nutrient[];
  public isLoadingMacros: boolean = true;
  public isLoadingMicros: boolean = true;
  public isSearching: boolean = false;
  public query: string = 'name';
  public searchInputMacros: string;
  public searchInputMicros: string;
  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _helperSvc: HelperService,
    private _nutrientSvc: NutrientService,
    private _router: RouterExtensions,
    public drawerSvc: DrawerService
  ) { }

  public changeQuery(): void {
    dialogs.action({
      title: 'Filter type',
      message: 'Choose the search filter',
      cancelButtonText: 'Cancel',
      actions: ['Name', 'Functions', 'Disease preventions', 'Deficiency', 'Toxicity']
    }).then((result: string) => {
      switch (result) {
        case 'Name':
          this.query = 'name';
          break;
        case 'Functions':
          this.query = 'functions';
          break;
        case 'Disease preventions':
          this.query = 'diseasePrev';
          break;
        case 'Deficiency':
          this.query = 'deficiency';
          break;
        case 'Toxicity':
          this.query = 'toxicity';
          break;

        default:
          this.query = 'name';
          break;
      }
    });
  }

  public clearSearchMacros(): void {
    this.searchInputMacros = '';
    //this.filteredMacronutrients = [...this._macronutrients];
    this.refreshMacros(null, true);
  }

  public clearSearchMicros(): void {
    this.searchInputMicros = '';
    //this.filteredMicronutrients = [...this._micronutrients];
    this.refreshMacros(null, true);
  }

  public openDetails(args: ListViewEventData, nutrientGroup: string): void {
    let selected: Nutrient = args.object.getSelectedItems()[0],
      navExtras: NavigationExtras = {
        queryParams: { nutrient: JSON.stringify(selected) }
      }
    setTimeout(() => this._router.navigate([`/nutrients/${nutrientGroup}`, selected.$key], navExtras), 1000);
  }

  public refreshMacros(args?: ListViewEventData, withFetch?: boolean): void {
    this._macronutrients = [];
    this._nutrientSvc.getMacronutrients(this.query, this.searchInputMicros, withFetch).subscribe((data: Nutrient) => this._macronutrients.push(data));
    setTimeout(() => {
      this.filteredMacronutrients = [...this._helperSvc.sortByName(this._macronutrients)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingMacros = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public refreshMicros(args?: ListViewEventData, withFetch?: boolean): void {
    this._micronutrients = [];
    this._nutrientSvc.getMicronutrients(this.query, this.searchInputMicros, withFetch).subscribe((data: Nutrient) => this._micronutrients.push(data));
    setTimeout(() => {
      this.filteredMicronutrients = [...this._helperSvc.sortByName(this._micronutrients)];
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this.isLoadingMicros = false;
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    }, 3000);
  }

  public searchMacros(searchTerm: string): void {
    //this.filteredMacronutrients = this._nutrientSvc.filterNutrient(this._macronutrients, this.query, searchTerm);
    this.searchInputMacros = searchTerm;
    this.refreshMacros(null, true);
  }

  public searchMicros(searchTerm: string): void {
    //this.filteredMicronutrients = this._nutrientSvc.filterNutrient(this._micronutrients, this.query, searchTerm);
    this.searchInputMicros = searchTerm;
    this.refreshMicros(null, true);
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
    this.searchInputMacros = '';
    this.searchInputMicros = '';
    setTimeout(() => this.refreshMacros(), 3000);
  }

  ngOnDestroy(): void {
    this._changeDetectionRef.detach();
    this._nutrientSvc.unsubscribeNutrients();
  }
}