// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

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
    this._nutrientSvc.storeNutrient(selected);
    setTimeout(() => this._router.navigate([`/nutrients/${nutrientGroup}`, selected.$key]), 1000);
  }

  public refreshMacros(args?: ListViewEventData): void {
    this._macronutrients = [];
    this._nutrientSvc.getMacronutrients().subscribe((data: firebase.FBData) => {
      if (data.type === 'ChildAdded') {
        let newNutrient: Nutrient = data.value;
        newNutrient.$key = data.key;
        this._macronutrients.push(newNutrient);
      } else if (data.type === 'ChildChanged' || data.type === 'ChildMoved') {
        this._macronutrients.forEach((food: Nutrient, idx: number) => {
          if (food.$key === data.key) {
            let newNutrient: Nutrient = data.value;
            newNutrient.$key = data.key;
            this._macronutrients[idx] = newNutrient;
          }
        });
      } else if (data.type === 'ChildRemoved') {
        this._macronutrients.forEach((food: Nutrient, idx: number) => {
          if (food.$key === data.key) {
            this._macronutrients.splice(idx, 1);
          }
        });
      }
      this.filteredMacronutrients = [...this._macronutrients];
      this.isLoadingMacros = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public refreshMicros(args?: ListViewEventData): void {
    this._micronutrients = [];
    this._nutrientSvc.getMicronutrients().subscribe((data: firebase.FBData) => {
      if (data.type === 'ChildAdded') {
        let newNutrient: Nutrient = data.value;
        newNutrient.$key = data.key;
        this._micronutrients.push(newNutrient);
      } else if (data.type === 'ChildChanged' || data.type === 'ChildMoved') {
        this._micronutrients.forEach((food: Nutrient, idx: number) => {
          if (food.$key === data.key) {
            let newNutrient: Nutrient = data.value;
            newNutrient.$key = data.key;
            this._micronutrients[idx] = newNutrient;
          }
        });
      } else if (data.type === 'ChildRemoved') {
        this._micronutrients.forEach((food: Nutrient, idx: number) => {
          if (food.$key === data.key) {
            this._micronutrients.splice(idx, 1);
          }
        });
      }
      this.filteredMicronutrients = [...this._micronutrients];
      this.isLoadingMicros = false;
      if (args) {
        args.object.notifyPullToRefreshFinished();
      }
      this._changeDetectionRef.detectChanges();
      this._changeDetectionRef.markForCheck();
    });
  }

  public searchMacros(searchTerm: string): void {
    this.filteredMacronutrients = this._nutrientSvc.filterNutrient(this._macronutrients, this.query, searchTerm);
  }

  public searchMicros(searchTerm: string): void {
    this.filteredMicronutrients = this._nutrientSvc.filterNutrient(this._micronutrients, this.query, searchTerm);
  }

  public toggleSearching(): void {
    this.isSearching = !this.isSearching;
  }

  ngOnInit(): void {
    this._nutrientSvc.keepOnSyncMacronutrients();
    this.refreshMacros();
    this._nutrientSvc.keepOnSyncMicronutrients();
    this.refreshMicros();
  }
}