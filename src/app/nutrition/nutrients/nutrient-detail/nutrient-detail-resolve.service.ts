import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Nutrient } from '../shared/nutrient.model';
import { NutrientService } from '../shared/nutrient.service';

@Injectable()
export class NutrientDetailResolve implements Resolve<Nutrient> {
  private nutrient: Nutrient;
  constructor(private nutrientSvc: NutrientService, private router: Router) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Nutrient> {
    console.log(route);
    let nutrientCategory: string = route.params['category'],
      nutrientKey: string | number = route.params['key'];
    return new Promise((resolve, reject) => {
      this.nutrientSvc.getNutrient(nutrientCategory, nutrientKey).subscribe((data: Nutrient) => {
        if (!!data) {
          this.nutrient = Object.assign({}, data);
        }
      });
      setTimeout(() => {
        if (!this.nutrient) {
          this.router.navigate(['nutrients']);
        } else {
          resolve(this.nutrient);
        }
      }, 1000);
    });
  }

}
