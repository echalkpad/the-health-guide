import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { Nutrient } from '../nutrient.model';
import { NutrientService } from './nutrient.service';

@Injectable()
export class MacronutrientResolve implements Resolve<Nutrient[]> {
    private macronutrients: Nutrient[] = [];
    constructor(private nutrientSvc: NutrientService, private router: Router) { }

    public resolve(): Promise<Nutrient[]> | boolean {
        return new Promise((resolve, reject) => {
            this.nutrientSvc.getMacronutrients().subscribe(
                (data: Nutrient[]) => {
                    if (!!data && !!data.length) {
                        this.macronutrients = [...data];
                    }
                }, (error: Error) => {
                    reject(error);
                    this.router.navigate(['/nutrition']);
                }
            );
            setTimeout(() => {
                if (!this.macronutrients) {
                    this.router.navigate(['/nutrition']);
                } else {
                    resolve(this.macronutrients);
                }
            }, 3000);
        });
    }

}
