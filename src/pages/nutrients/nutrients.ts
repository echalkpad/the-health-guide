// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { NavController, NavParams } from 'ionic-angular';

// Models
import { INutrientDetails } from '../../models';

// Providers
import { NutrientDataService } from '../../providers';

@Component({
  selector: 'page-nutrients',
  templateUrl: 'nutrients.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientsPage {
  public nutrients$: Observable<Array<INutrientDetails>>;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _nutrientDataSvc: NutrientDataService
  ) {}

  ionViewWillEnter() {
    console.log('Entering...');
    this.nutrients$ = this._nutrientDataSvc.getNutrients$(true);
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
