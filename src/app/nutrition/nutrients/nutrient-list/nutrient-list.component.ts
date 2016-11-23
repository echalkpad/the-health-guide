import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TdLoadingService } from '@covalent/core';

import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private detector: ChangeDetectorRef,
    private loadingSvc: TdLoadingService,
    private nutrientSvc: NutrientService,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) { }

  public filterNutrients(searchTerm: string): void {
    this.filteredMacronutrients = this.nutrientSvc.filterNutrient(this.macronutrients, this.query, searchTerm);
    this.filteredMicronutrients = this.nutrientSvc.filterNutrient(this.micronutrients, this.query, searchTerm);
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
    this.detector.markForCheck();
    setTimeout(() => {
      this.loadingSvc.resolve('macronutrients.load');
      this.loadingSvc.resolve('micronutrients.load');
      this.detector.markForCheck();
    }, 1000);
    setTimeout(() => {
      this.detector.markForCheck();
    }, 2000);

    this.titleSvc.setTitle("Nutrients");
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { macronutrients: Nutrient[], micronutrients: Nutrient[] }) => {
      if (!!data) {
        this.macronutrients = [...data.macronutrients];
        this.micronutrients = [...data.micronutrients];
        this.filteredMacronutrients = [...data.macronutrients];
        this.filteredMicronutrients = [...data.micronutrients];
      }
    });
  }

}
