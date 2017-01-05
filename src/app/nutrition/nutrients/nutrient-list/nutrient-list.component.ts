import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { TdLoadingService } from '@covalent/core';
import { TdDialogService } from '@covalent/core';

import { DataService } from '../../shared/data.service';
import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

@Component({
  selector: 'app-nutrients',
  templateUrl: './nutrient-list.component.html',
  styleUrls: ['./nutrient-list.component.scss']
})
export class NutrientListComponent implements AfterViewInit, OnInit {
  public filteredMacronutrients: Nutrient[] = [];
  public filteredMicronutrients: Nutrient[] = [];
  public macronutrients: Nutrient[] = [];
  public micronutrients: Nutrient[] = [];
  public query: string = 'name';
  public querySearch: boolean = false;
  constructor(
    private _dataSvc: DataService,
    private _dialogSvc: TdDialogService,
    private _loadingSvc: TdLoadingService,
    private _nutrientSvc: NutrientService,
    private _router: Router,
    private _titleSvc: Title
  ) { }

  private _showAlert(): void {
    this._dialogSvc.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    }).afterClosed().subscribe(() => this._router.navigate(['/nutrition']));
  }

  public filterNutrients(searchTerm: string): void {
    this.filteredMacronutrients = this._nutrientSvc.filterNutrient(this.macronutrients, this.query, searchTerm);
    this.filteredMicronutrients = this._nutrientSvc.filterNutrient(this.micronutrients, this.query, searchTerm);
  }

  public openDetails(nutrientClass: string, nutrient: Nutrient): void {
    this._dataSvc.saveNutrient(nutrient);
    this._router.navigate([`/nutrition/nutrients/${nutrientClass}/${nutrient.$key}`]);
  }

  public toggleSearch(): void {
    if (this.querySearch) {
      this.filterNutrients('');
    }
    this.querySearch = !this.querySearch;
  }

  ngAfterViewInit(): void {
    this._loadingSvc.register('macronutrients.load');
    this._loadingSvc.register('micronutrients.load');
    setTimeout(() => {
      this._loadingSvc.resolve('macronutrients.load');
      this._loadingSvc.resolve('micronutrients.load');
      if (!this.macronutrients.length || !this.micronutrients.length) {
        this._showAlert();
      }
    }, 3000);
    this._titleSvc.setTitle("Nutrients");
  }

  ngOnInit(): void {
    this._nutrientSvc.getMacronutrients().subscribe((data: Nutrient[]) => {
      if (!!data && !!data.length) {
        this.macronutrients = [...data];
        this.filteredMacronutrients = [...data];
        this._loadingSvc.resolve('macronutrients.load');
      }
    });
    this._nutrientSvc.getMicronutrients().subscribe((data: Nutrient[]) => {
      if (!!data && !!data.length) {
        this.micronutrients = [...data];
        this.filteredMicronutrients = [...data];
        this._loadingSvc.resolve('micronutrients.load');
      }
    });
  }

}
