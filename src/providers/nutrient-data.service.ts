import { Injectable } from '@angular/core';
import { Database } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Models
import { INutrientDetails } from '../models';

@Injectable()
export class NutrientDataService {
  constructor(private _db: Database) {
    _db.connect();
    _db.collection('nutrients');
    _db.status().subscribe((status: { type: string }) => {
      console.log(status.type);
    });
  }

  public getNutrients$(reactive: boolean): Observable<any> {
    return new Observable((observer: Observer<Array<INutrientDetails>>) => {
      if (reactive) {
        this._db.collection('nutrients').watch().subscribe((nutrients: Array<INutrientDetails>) => {
          observer.next(nutrients);
        }, (error) => {
          console.error(error);
        });
      } else {
        this._db.collection('nutrients').fetch().subscribe((nutrients: Array<INutrientDetails>) => {
          observer.next(nutrients);
        }, (error) => {
          console.error(error);
        });
      }
    });
  }

}
