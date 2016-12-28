import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ListViewEventData } from 'nativescript-telerik-ui/listview';
import * as dialogs from 'ui/dialogs';

import { DataService, DrawerService, HelperService } from '../../shared';
import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

@Component({
  moduleId: module.id,
  selector: 'thg-nutrients',
  templateUrl: 'nutrient-list.component.html',
  styleUrls: ['nutrient-list.component.css']
})
export class NutrientListComponent implements OnInit {
  private macronutrients: Nutrient[];
  private micronutrients: Nutrient[];
  public filteredMacronutrients: Nutrient[];
  public filteredMicronutrients: Nutrient[];
  public isLoadingMacros: boolean = true;
  public isLoadingMicros: boolean = true;
  public isSearching: boolean = false;
  public query: string = 'name';
  public searchInputMacros: string = '';
  public searchInputMicros: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private dataSvc: DataService,
    public drawerSvc: DrawerService,
    private helperSvc: HelperService,
    private nutrientSvc: NutrientService,
    private router: Router
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
    this.filteredMacronutrients = [...this.macronutrients];
  }

  public clearSearchMicros(): void {
    this.searchInputMicros = '';
    this.filteredMicronutrients = [...this.micronutrients];
  }

  public openDetails(args: ListViewEventData, nutrientGroup: string): void {
    let selected: Nutrient = args.object.getSelectedItems()[0];
    console.log(JSON.stringify(selected));
    this.dataSvc.saveNutrient(selected);
    setTimeout(() => this.router.navigate([`/nutrients/${nutrientGroup}`, selected.$key]), 1000);
  }

  public refreshMacros(args: ListViewEventData): void {
    this.nutrientSvc.getMacronutrients().then((data: Nutrient[]) => {
      this.macronutrients = this.helperSvc.sortByName(data);
      this.filteredMacronutrients = [...this.macronutrients];
      this.isLoadingMacros = false;
      args.object.notifyPullToRefreshFinished();
      this.changeDetectionRef.markForCheck();
    });
  }

  public refreshMicros(args: ListViewEventData): void {
    this.nutrientSvc.getMicronutrients().then((data: Nutrient[]) => {
      this.micronutrients = this.helperSvc.sortByName(data);
      this.filteredMicronutrients = [...this.micronutrients];
      this.isLoadingMicros = false;
      args.object.notifyPullToRefreshFinished();
      this.changeDetectionRef.markForCheck();
    });
  }

  public searchMacros(searchTerm: string): void {
    this.filteredMacronutrients = this.nutrientSvc.filterNutrient(this.macronutrients, this.query, searchTerm);
  }

  public searchMicros(searchTerm: string): void {
    this.filteredMicronutrients = this.nutrientSvc.filterNutrient(this.micronutrients, this.query, searchTerm);
  }

  ngOnInit(): void {
    Promise.all([
      this.nutrientSvc.getMacronutrients(),
      this.nutrientSvc.getMicronutrients()
    ]).then((data: Array<Nutrient[]>) => {
      this.macronutrients = this.helperSvc.sortByName(data[0]);
      this.micronutrients = this.helperSvc.sortByName(data[1]);
      this.filteredMacronutrients = [...this.macronutrients];
      this.filteredMicronutrients = [...this.micronutrients];
      this.isLoadingMacros = false;
      this.isLoadingMicros = false;
      this.changeDetectionRef.detectChanges();
    });
  }
}