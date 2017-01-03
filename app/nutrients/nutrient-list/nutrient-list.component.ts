// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';

// Telerik
import { ListViewEventData } from 'nativescript-telerik-ui/listview';

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
export class NutrientListComponent implements OnInit {
  private _macronutrients: Nutrient[];
  private _micronutrients: Nutrient[];
  public filteredMacronutrients: Nutrient[];
  public filteredMicronutrients: Nutrient[];
  public isLoadingMacros: boolean = true;
  public isLoadingMicros: boolean = true;
  public isSearching: boolean = false;
  public query: string = 'name';
  public searchInputMacros: string = '';
  public searchInputMicros: string = '';
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
    this.filteredMacronutrients = [...this._macronutrients];
  }

  public clearSearchMicros(): void {
    this.searchInputMicros = '';
    this.filteredMicronutrients = [...this._micronutrients];
  }

  public openDetails(args: ListViewEventData, nutrientGroup: string): void {
    let selected: Nutrient = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this._nutrientSvc.storeNutrient(selected);
    setTimeout(() => this._router.navigate([`/nutrients/${nutrientGroup}`, selected.$key]), 1000);
  }

  public refreshMacros(args: ListViewEventData): void {
    
    this._nutrientSvc.getMacronutrients().then((data: Nutrient[]) => {
      this._macronutrients = this._helperSvc.sortByName(data);
      this.filteredMacronutrients = [...this._macronutrients];
      this.isLoadingMacros = false;
      setTimeout(() => {
        args.object.notifyPullToRefreshFinished();
        this._changeDetectionRef.markForCheck();
      }, 2000);
    });
  }

  public refreshMicros(args: ListViewEventData): void {
    
    this._nutrientSvc.getMicronutrients().then((data: Nutrient[]) => {
      this._micronutrients = this._helperSvc.sortByName(data);
      this.filteredMicronutrients = [...this._micronutrients];
      this.isLoadingMicros = false;
      setTimeout(() => {
        args.object.notifyPullToRefreshFinished();
        this._changeDetectionRef.markForCheck();
      }, 2000);
    });
  }

  public searchMacros(searchTerm: string): void {
    this.filteredMacronutrients = this._nutrientSvc.filterNutrient(this._macronutrients, this.query, searchTerm);
  }

  public searchMicros(searchTerm: string): void {
    this.filteredMicronutrients = this._nutrientSvc.filterNutrient(this._micronutrients, this.query, searchTerm);
  }

  ngOnInit(): void {
    Promise.all([
      this._nutrientSvc.getMacronutrients(),
      this._nutrientSvc.getMicronutrients()
    ]).then((data: Array<Nutrient[]>) => {
      this._macronutrients = this._helperSvc.sortByName(data[0]);
      this._micronutrients = this._helperSvc.sortByName(data[1]);
      this.filteredMacronutrients = [...this._macronutrients];
      this.filteredMicronutrients = [...this._micronutrients];
      this.isLoadingMacros = false;
      this.isLoadingMicros = false;
      this._changeDetectionRef.markForCheck();
    });
  }
}