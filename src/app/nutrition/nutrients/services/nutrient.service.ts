import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Nutrient } from '../nutrient.model';

@Injectable()
export class NutrientService {
  private macronutrients: FirebaseListObservable<Nutrient[]>;
  private micronutrients: FirebaseListObservable<Nutrient[]>;
  constructor(private af: AngularFire) {
    this.macronutrients = af.database.list('/macronutrients', {
      query: {
        orderByChild: 'name'
      }
    });
    this.micronutrients = af.database.list('/micronutrients', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public getMacronutrients(): FirebaseListObservable<Nutrient[]> {
    return this.macronutrients;
  }

  public getMicronutrients(): FirebaseListObservable<Nutrient[]> {
    return this.micronutrients;
  }

}
