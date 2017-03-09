// App
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { NavController, NavParams } from 'ionic-angular';

// Models
import { INutrientDetails } from '../../models';

// Pages
import { NutrientDetailsPage } from '../nutrient-details/nutrient-details';

// Providers
import { NutrientDataService } from '../../providers';

@Component({
  selector: 'page-nutrient-list',
  templateUrl: 'nutrient-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientListPage {
  public detailsPage: any = NutrientDetailsPage;
  public nutrients$: Observable<Array<INutrientDetails>>;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _nutrientDataSvc: NutrientDataService
  ) { }

  public itemParams(id: string): Object {
    return { id }
  }

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