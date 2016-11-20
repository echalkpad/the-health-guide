import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { Nutrient } from '../nutrient.model';
import { NutrientService } from './nutrient.service';

@Injectable()
export class MicronutrientResolve implements Resolve<Nutrient[]> {
    private micronutrients: Nutrient[] = [];
    constructor(private nutrientSvc: NutrientService, private router: Router) { }

    public resolve(): Promise<Nutrient[]> | boolean {
        return new Promise((resolve, reject) => {
            this.nutrientSvc.getMicronutrients().subscribe(
                (data: Nutrient[]) => {
                    if (!!data && !!data.length) {
                        this.micronutrients = [...data];
                    }
                }, (error: Error) => {
                    reject(error);
                    this.router.navigate(['/nutrition']);
                }
            );
            setTimeout(() => {
                if (!this.micronutrients) {
                    this.router.navigate(['/nutrition']);
                } else {
                    resolve(this.micronutrients);
                }
            }, 3000);
        });
    }

}
