// Angular
import { Injectable } from '@angular/core';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  private _macronutrients: Nutrient[];
  private _micronutrients: Nutrient[];
  private _nutrient: Nutrient;
  constructor() { }

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

  public getMacronutrients(withFetch?: boolean): Promise<Nutrient[]> {
    return new Promise((resolve, reject) => {
      if (!withFetch && !!this._macronutrients && !!this._macronutrients.length) {
        resolve(this._macronutrients);
      } else {
        this.keepOnSyncMacronutrients();
        this._macronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              reject(res['error']);
            } else {
              this._macronutrients = [...res.value];
              resolve(res.value);
            }
          },
          '/macronutrients',
          {
            singleEvent: true,
            orderBy: {
              type: firebase.QueryOrderByType.CHILD,
              value: 'name'
            }
          }
        );
      }
    });
  }

  public getMicronutrients(withFetch?: boolean): Promise<Nutrient[]> {
    return new Promise((resolve, reject) => {
      if (!withFetch && !!this._micronutrients && !!this._micronutrients.length) {
        resolve(this._micronutrients);
      } else {
        this.keepOnSyncMicronutrients();
        this._micronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              reject(res['error']);
            } else {
              this._micronutrients = [...res.value];
              resolve(res.value);
            }
          },
          '/micronutrients',
          {
            singleEvent: true,
            orderBy: {
              type: firebase.QueryOrderByType.CHILD,
              value: 'name'
            }
          }
        );
      }
    });
  }

  public getNutrient(): Nutrient {
    return this._nutrient;
  }

  public keepOnSyncMacronutrients(): void {
    firebase.keepInSync('/macronutrients', true).then(
      function () {
        console.log("firebase.keepInSync is ON for macronutrients");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
    );
  }

  public keepOnSyncMicronutrients(): void {
    firebase.keepInSync('/micronutrients', true).then(
      function () {
        console.log("firebase.keepInSync is ON for micronutrients");
      },
      function (error) {
        console.log("firebase.keepInSync error: " + error);
      }
    );
  }

  public storeNutrient(nutrient: Nutrient): void {
    this._nutrient = nutrient;
  }

}


/**
 * Observable version
 * public getMicronutrients(): Promise<Nutrient[]> {
    if (this._microObserver && !this._microObserver.closed) {
      this._microObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<firebase.FBData>) => {
      this._microObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._microObserver.error(res['error']);
          } else {
            this._microObserver.next(res);
          }
        },
        '/micronutrients',
        {
          singleEvent: false,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'name'
          }
        }
      );
    });
  }
 */