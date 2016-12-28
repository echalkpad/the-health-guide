import { Injectable } from '@angular/core';

import * as firebase from 'nativescript-plugin-firebase';

import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  constructor() {
    firebase.keepInSync(
      '/macronutrients',
      true
    ).then(
      function () {
        console.log("firebase.keepInSync is ON for macronutrients");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
      );

    firebase.keepInSync(
      '/micronutrients',
      true
    ).then(
      function () {
        console.log("firebase.keepInSync is ON for micronutrients");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
      );
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

  public getMacronutrients(): Promise<Nutrient[]> {
    return new Promise((resolve, reject) => {
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            reject(res);
          } else {
            resolve(res.value);
          }
        },
        'macronutrients',
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }

  public getMicronutrients(): Promise<Nutrient[]> {
    return new Promise((resolve, reject) => {
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            reject(res);
          } else {
            resolve(res.value);
          }
        },
        'micronutrients',
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }

}
