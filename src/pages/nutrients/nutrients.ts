import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
//import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-nutrients',
  templateUrl: 'nutrients.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientsPage {

  constructor(
    private _detectorRef: ChangeDetectorRef,
  ) {}

  ionViewWillEnter() {
    console.log('Entering...');
  }

  ionViewWillUnload() {
    console.log('Destroying...');
    this._detectorRef.detach();
  }

}
