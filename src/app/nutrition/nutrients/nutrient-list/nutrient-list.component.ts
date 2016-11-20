import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TdLoadingService } from '@covalent/core';

import { Nutrient } from '../shared/nutrient.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nutrients',
  templateUrl: './nutrient-list.component.html',
  styleUrls: ['./nutrient-list.component.scss']
})
export class NutrientListComponent implements AfterViewInit, OnInit {
  public macronutrients: Nutrient[] = [];
  public micronutrients: Nutrient[] = [];
  constructor(
    private detector: ChangeDetectorRef,
    private loadingSvc: TdLoadingService,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) { }

  ngAfterViewInit(): void {
    this.loadingSvc.register('macronutrients.load');
    this.loadingSvc.register('micronutrients.load');
    this.detector.markForCheck();
    setTimeout(() => {
      this.loadingSvc.resolve('macronutrients.load');
      this.loadingSvc.resolve('micronutrients.load');
    }, 1000);
    setTimeout(() => {
      this.detector.markForCheck();
    }, 2000);

    this.titleSvc.setTitle("Nutrients");
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { macronutrients: Nutrient[], micronutrients: Nutrient[] }) => {
      console.log(data);
      if (!!data) {
        this.macronutrients = [...data.macronutrients];
        this.micronutrients = [...data.micronutrients];
      }
    });
  }

}
