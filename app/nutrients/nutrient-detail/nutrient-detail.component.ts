// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

// THG
import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

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
    private _detectorRef: ChangeDetectorRef,
    private _nutrientSvc: NutrientService,
    private _route: ActivatedRoute,
    private _router: RouterExtensions
  ) { }

  public goBack(): void {
    this._router.back();
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params: Params) => {
      this.nutrient = JSON.parse(params['nutrient']);
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
    });
  }
}