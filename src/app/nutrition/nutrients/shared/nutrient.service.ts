import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Nutrient } from './nutrient.model';

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
    return this.macronutrients;
  }

  public getMicronutrients(): FirebaseListObservable<Nutrient[]> {
    return this.micronutrients;
  }

  public getNutrient(category: string, key: string | number): FirebaseObjectObservable<Nutrient> {
    return this.af.database.object(`/${category}/${key}`);
  }

}
