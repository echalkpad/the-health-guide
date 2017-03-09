// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

// Models
//import { INutrientDetails } from '../../models';

// Providers
import { NutrientDataService } from '../../providers';

@Component({
  selector: 'page-nutrient-details',
  templateUrl: 'nutrient-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientDetailsPage {
  public nutrient$: Observable<any>;
  public nutrientDetail: string = 'summary';
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _nutrientDataSvc: NutrientDataService
  ) { }

  ionViewWillEnter() {
    this.nutrient$ = this._nutrientDataSvc.getNutrient$(this._navParams.get('id'));
    this._detectorRef.markForCheck();
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
