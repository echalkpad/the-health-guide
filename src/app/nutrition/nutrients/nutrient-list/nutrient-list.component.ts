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
    private dataSvc: DataService,
    private dialogService: TdDialogService,
    private loadingSvc: TdLoadingService,
    private nutrientSvc: NutrientService,
    private router: Router,
    private titleSvc: Title
  ) { }

  private showAlert(): void {
    this.dialogService.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    }).afterClosed().subscribe(() => this.router.navigate(['/nutrition']));
  }

  public filterNutrients(searchTerm: string): void {
    this.filteredMacronutrients = this.nutrientSvc.filterNutrient(this.macronutrients, this.query, searchTerm);
    this.filteredMicronutrients = this.nutrientSvc.filterNutrient(this.micronutrients, this.query, searchTerm);
  }

  public openDetails(nutrientClass: string, nutrient: Nutrient): void {
    this.dataSvc.saveNutrient(nutrient);
    this.router.navigate([`/nutrition/nutrients/${nutrientClass}/${nutrient.$key}`]);
  }

  public toggleSearch(): void {
    if (this.querySearch) {
      this.filterNutrients('');
    }
    this.querySearch = !this.querySearch;
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('macronutrients.load');
    this.loadingSvc.register('micronutrients.load');
    setTimeout(() => {
      this.loadingSvc.resolve('macronutrients.load');
      this.loadingSvc.resolve('micronutrients.load');
      if (!this.macronutrients.length || !this.micronutrients.length) {
        this.showAlert();
      }
    }, 5000);
    this.titleSvc.setTitle("Nutrients");
  }

  ngOnInit(): void {
    this.nutrientSvc.getMacronutrients().subscribe((data: Nutrient[]) => {
      if (!!data && !!data.length) {
        this.macronutrients = [...data];
        this.filteredMacronutrients = [...data];
      }
    });
    this.nutrientSvc.getMicronutrients().subscribe((data: Nutrient[]) => {
      if (!!data && !!data.length) {
        this.micronutrients = [...data];
        this.filteredMicronutrients = [...data];
      }
    });
  }

}
