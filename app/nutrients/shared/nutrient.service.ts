import { Injectable } from '@angular/core';

import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  constructor() {
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

}
