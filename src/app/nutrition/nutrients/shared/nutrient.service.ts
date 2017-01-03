import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  private _macronutrients: FirebaseListObservable<Nutrient[]>;
  private _micronutrients: FirebaseListObservable<Nutrient[]>;
  constructor(private _af: AngularFire) {
    this._macronutrients = _af.database.list('/macronutrients', {
      query: {
        orderByChild: 'name'
      }
    });
    this._micronutrients = _af.database.list('/micronutrients', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  public filterNutrient(nutrients: Nutrient[], query: string, searchTerm: string): Nutrient[] {
    return nutrients.filter((item: Nutrient) => {
      let match: boolean = false;
      if (typeof item[query] === 'object') {
        item[query].forEach((prop: string) => {
          if (prop.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
            match = true;
          }
        });
        return match;
      } 
      return item[query].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    });
  }

  public getMacronutrients(): FirebaseListObservable<Nutrient[]> {
    return this._macronutrients;
  }

  public getMicronutrients(): FirebaseListObservable<Nutrient[]> {
    return this._micronutrients;
  }

  public getNutrient(category: string, key: string | number): FirebaseObjectObservable<Nutrient> {
    return this._af.database.object(`/${category}/${key}`);
  }

}
