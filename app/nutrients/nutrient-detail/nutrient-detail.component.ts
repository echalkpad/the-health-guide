// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Nativescript
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

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
export class NutrientDetailComponent {
  public nutrient: Nutrient;
  public nutrientClassification: string;
  public nutrientDiseases: string;
  public nutrientFunctions: string;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _nutrientSvc: NutrientService,
    private _params: ModalDialogParams
  ) {
    this.nutrient = _params.context;
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
  }

  public goBack(): void {
    this._params.closeCallback();
  }
}