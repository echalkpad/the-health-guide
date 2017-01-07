// Angular
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  private _macroObserver: Subscriber<firebase.FBData>;
  private _microObserver: Subscriber<firebase.FBData>;
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

  public getMacronutrients(): Observable<firebase.FBData> {
    if (this._macroObserver && !this._macroObserver.closed) {
      this._macroObserver.unsubscribe();
    }
    return new Observable((observer: Subscriber<firebase.FBData>) => {
      this._macroObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._macroObserver.error(res['error']);
          } else {
            this._macroObserver.next(res);
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
    });
  }

  public getMicronutrients(): Observable<firebase.FBData> {
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
