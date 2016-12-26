import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../../shared/data.service';
import { Nutrient } from '../shared/nutrient.model';

@Injectable()
export class NutrientDetailResolve implements Resolve<Nutrient> {

  constructor(private dataSvc: DataService) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Nutrient> {
    return new Promise((resolve, reject) => {
      resolve(this.dataSvc.getNutrient());
    });
  }

}
