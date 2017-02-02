// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Lodash
import * as _ from 'lodash';

// Firebase
import * as firebase from 'nativescript-plugin-firebase';

// THG
import { Nutrient } from './nutrient.model';

@Injectable()
export class NutrientService {
  private _macroObserver: Subscriber<Nutrient>;
  private _microObserver: Subscriber<Nutrient>;
  constructor() { }

  public filterNutrient(nutrient: Nutrient, query: string, searchQuery: string): boolean {
    let match: boolean = false;
    if (typeof nutrient[query] === 'object') {
      nutrient[query].forEach((prop: string) => {
        if (prop.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
          match = true;
        }
      });
      return match;
    }

    return nutrient[query].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
  }

  public filterNutrients(nutrients: Nutrient[], query: string, searchQuery: string): Nutrient[] {
    return nutrients.filter((item: Nutrient) => {
      let match: boolean = false;
      if (typeof item[query] === 'object') {
        item[query].forEach((prop: string) => {
          if (prop.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
            match = true;
          }
        });
        return match;
      }
      return item[query].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    });
  }

  public getMicronutrients(searchBy: string, searchQuery: string): Observable<Nutrient> {
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._microObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._microObserver.error(res['error']);
          } else if (this.filterNutrient(res.value, searchBy, searchQuery)) {
            let newNutrient: Nutrient = _.assign({ id: res.key, $type: res.type }, res.value);
            this._microObserver.next(newNutrient);
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

  public getMacronutrients(searchBy: string, searchQuery: string): Observable<Nutrient> {
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._macroObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._macroObserver.error(res['error']);
          } else if (this.filterNutrient(res.value, searchBy, searchQuery)) {
            let newNutrient: Nutrient = _.assign({ id: res.key, $type: res.type }, res.value);
            this._macroObserver.next(newNutrient);
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

  public unsubscribeNutrients(): void {
    if (!!this._macroObserver && !this._macroObserver.closed) {
      this._macroObserver.unsubscribe();
    }
    if (!!this._microObserver && !this._microObserver.closed) {
      this._microObserver.unsubscribe();
    }
  }

}