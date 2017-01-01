// Angular
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// THG
import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

@Injectable()
export class NutrientDetailResolve implements Resolve<Nutrient> {

  constructor(private nutrientSvc: NutrientService) { }

  public resolve(): Promise<Nutrient> {
    return new Promise((resolve, reject) => {
      resolve(this.nutrientSvc.getNutrient());
    });
  }

}
