import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from '@angular/router';

import { Nutrient } from '../shared/nutrient.model';

@Component({
  moduleId: module.id,
  selector: 'thg-nutrient-detail',
  templateUrl: 'nutrient-detail.component.html',
  styleUrls: ['nutrient-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientDetailComponent implements OnInit {
  public nutrient: Nutrient;
  public nutrientClassification: string = '';
  public nutrientDiseases: string = '';
  public nutrientFunctions: string = '';
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public goBack(): void {
    this.router.navigate(['/nutrients']);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { nutrient: Nutrient }) => {
      this.nutrient = data.nutrient;
      if (this.nutrient.hasOwnProperty('classification')) {
        this.nutrient.classification.forEach((item: any) => {
          this.nutrientClassification += `<h3>${item.name}</h3><p>${item.description}</p>`;
        });
      } else {
        this.nutrientClassification = 'There are no major classifications for this nutrient';
      }
      this.nutrient.diseasePrev.forEach((item: string) => {
        this.nutrientDiseases += `&#8226; ${item}<br/>`;
      });

      this.nutrient.functions.forEach((item: string) => {
        this.nutrientFunctions += `&#8226; ${item}<br/>`;
      });

      this.changeDetectionRef.detectChanges();
    });
  }
}