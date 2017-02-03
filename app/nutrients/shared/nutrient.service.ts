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

  public filterNutrient(nutrient: Nutrient, searchBy: string, searchQuery: string): boolean {
    let match: boolean = false;
    if (typeof nutrient[searchBy] === 'object') {
      nutrient[searchBy].forEach((prop: string) => {
        if (prop.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
          match = true;
        }
      });
      return match;
    }

    return nutrient[searchBy].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
  }

  public filterNutrients(nutrients: Nutrient[], searchBy: string, searchQuery: string): Nutrient[] {
    return nutrients.filter((item: Nutrient) => {
      let match: boolean = false;
      if (typeof item[searchBy] === 'object') {
        item[searchBy].forEach((prop: string) => {
          if (prop.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
            match = true;
          }
        });
        return match;
      }
      return item[searchBy].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    });
  }

  public getMicronutrients(): Observable<Nutrient> {
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._microObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._microObserver.error(res['error']);
          } else {
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
    });
  }

  public getMacronutrients(): Observable<Nutrient> {
    return new Observable((observer: Subscriber<Nutrient>) => {
      this._macroObserver = observer;
      firebase.query(
        (res: firebase.FBData) => {
          if (res.hasOwnProperty('error')) {
            this._macroObserver.error(res['error']);
          } else {
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