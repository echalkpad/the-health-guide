// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Nativescript
import * as connectivity from 'connectivity';

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
  constructor() { }

  public filterNutrient(nutrient: Nutrient, query: string, searchTerm: string): boolean {
    let match: boolean = false;
    if (typeof nutrient[query] === 'object') {
      nutrient[query].forEach((prop: string) => {
        if (prop.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          match = true;
        }
      });
      return match;
    }

    return nutrient[query].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }

  public filterNutrients(nutrients: Nutrient[], query: string, searchTerm: string): Nutrient[] {
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

  public getMacronutrients(query: string, searchTerm: string, withFetch?: boolean): Observable<Nutrient> {
    let connectionType = connectivity.getConnectionType(),
      limit: number = 50;

    return new Observable((observer: Subscriber<Nutrient>) => {
      this._macroObserver = observer;
      if (!!this._macronutrients && !withFetch) {
        this._macronutrients.forEach((item: Nutrient, idx: number) => {
          if (idx < limit) {
            this._macroObserver.next(item)
          }
        });
      } else {
        this._macronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._macroObserver.error(res['error']);
            } else if (res.type === 'ChildAdded' && this._macronutrients.length < limit && this.filterNutrient(res.value, query, searchTerm)) {
              this._macronutrients.push(res.value);
              this._macroObserver.next(res.value);
            } else if (this._macronutrients.length === limit) {
              this._macroObserver.complete();
            }
          },
          '/macronutrients',
          {
            singleEvent: false,
            orderBy: {
              type: firebase.QueryOrderByType.CHILD,
              value: 'name'
            },
            limit: {
              type: firebase.QueryLimitType.FIRST,
              value: limit
            }
          }
        );
      }
    });
  }

  public getMicronutrients(query: string, searchTerm: string, withFetch?: boolean): Observable<Nutrient> {
    let connectionType = connectivity.getConnectionType(),
      limit: number = 50;

    return new Observable((observer: Subscriber<Nutrient>) => {
      this._microObserver = observer;
      if (!!this._micronutrients && !withFetch) {
        this._micronutrients.forEach((item: Nutrient, idx: number) => {
          if (idx < limit) {
            this._microObserver.next(item)
          }
        });
      } else {
        this._micronutrients = [];
        firebase.query(
          (res: firebase.FBData) => {
            if (res.hasOwnProperty('error')) {
              this._microObserver.error(res['error']);
            } else if (res.type === 'ChildAdded' && this._micronutrients.length < limit && this.filterNutrient(res.value, query, searchTerm)) {
              this._micronutrients.push(res.value);
              this._microObserver.next(res.value);
            } else if (this._micronutrients.length === limit) {
              this._microObserver.complete();
            }
          },
          '/micronutrients',
          {
            singleEvent: false,
            orderBy: {
              type: firebase.QueryOrderByType.CHILD,
              value: 'name'
            },
            limit: {
              type: firebase.QueryLimitType.FIRST,
              value: limit
            }
          }
        );
      }
    });
  }

  public keepOnSyncMacronutrients(): void {
    firebase.keepInSync('/macronutrients', true).then(
      function () {
        console.log('firebase.keepInSync is ON for macronutrients');
      },
      function (error) {
        console.log('firebase.keepInSync error: ' + error);
      }
    );
  }

  public keepOnSyncMicronutrients(): void {
    firebase.keepInSync('/micronutrients', true).then(
      function () {
        console.log('firebase.keepInSync is ON for micronutrients');
      },
      function (error) {
        console.log('firebase.keepInSync error: ' + error);
      }
    );
  }

  public unsubscribeNutrients(): void {
    if (!!this._macroObserver && !this._macroObserver.closed) {
      this._macroObserver.unsubscribe();
    }
    if (!!this._microObserver && !this._microObserver.closed) {
      this._microObserver.unsubscribe();
    }
  }

}