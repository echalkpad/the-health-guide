import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TdLoadingService } from '@covalent/core';

import { Nutrient } from './nutrient.model';

@Component({
  selector: 'app-nutrients',
  templateUrl: './nutrients.component.html',
  styleUrls: ['./nutrients.component.scss']
})
export class NutrientsComponent implements AfterViewInit, OnInit {
  public macronutrients: Nutrient[] = [];
  public micronutrients: Nutrient[] = [];
  constructor(private loadingSvc: TdLoadingService, private route: ActivatedRoute, private titleSvc: Title) { }

  ngAfterViewInit(): void {
    this.loadingSvc.register('macronutrients.load');
    this.loadingSvc.register('micronutrients.load');
    setTimeout(() => {
      this.loadingSvc.resolve('macronutrients.load');
      this.loadingSvc.resolve('micronutrients.load')
    }, 1000);

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
