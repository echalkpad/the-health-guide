// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  private _macronutrients: Nutrient[];
  private _macroObserver: Subscriber<Nutrient>;
  private _micronutrients: Nutrient[];
  private _microObserver: Subscriber<Nutrient>;
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

  public getMacronutrients(withFetch?: boolean): Observable<Nutrient> {
    if (this._macroObserver && !this._macroObserver.closed) {
      this._macroObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._macroObserver = observer;
      if (!withFetch && !!this._macronutrients && !!this._macronutrients.length) {
        this._macronutrients.forEach((item: Nutrient) => this._macroObserver.next(item));
      } else {
        this.keepOnSyncMicronutrients();
        this._macronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._macroObserver.error(res['error']);
            } else if (res.type === 'ChildAdded') {
              this._macronutrients.push(res.value);
              this._macroObserver.next(res.value);
            }
          },
          '/macronutrients',
          {
            singleEvent: false,
            orderBy: {
              type: firebase.QueryOrderByType.CHILD,
              value: 'name'
            }
          }
        );
      }
    });
  }

  public getMicronutrients(withFetch?: boolean): Observable<Nutrient> {
    if (this._microObserver && !this._microObserver.closed) {
      this._microObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._microObserver = observer;
      if (!withFetch && !!this._micronutrients && !!this._micronutrients.length) {
        this._micronutrients.forEach((item: Nutrient) => this._microObserver.next(item));
      } else {
        this.keepOnSyncMicronutrients();
        this._micronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._microObserver.error(res['error']);
            } else if (res.type === 'ChildAdded') {
              this._micronutrients.push(res.value);
              this._microObserver.next(res.value);
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
 * 
 */