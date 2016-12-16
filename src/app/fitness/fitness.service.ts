import { Injectable } from '@angular/core';

import { Auth } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { Fitness } from './fitness.model';

@Injectable()
export class FitnessService {

  constructor() { }

  private setBMR(fit: Fitness): void {
    if (fit.gender === 'male') {
      fit.bmr = Math.floor(13.397 * fit.weight + 4.799 * fit.height - 5.677 * fit.age + 88.362);
    } else {
      fit.bmr = Math.floor(9.247 * fit.weight + 3.098 * fit.height - 4.33 * fit.age + 447.593);
    }
  };

  private setBMI(fit: Fitness): void {
    fit.bmi.data = +(10000 * fit.weight / Math.pow(fit.height, 2)).toFixed(2);
    if (fit.bmi.data > 25 || fit.bmi.data < 18) {
      fit.bmi.normal = false;
    } else {
      fit.bmi.normal = true;
    }
  }

  private setBodyFatFemale(fit: Fitness): void {
    let bodyFatWeight: number = 0, leanBodyMass: number = 0;
    leanBodyMass = ((fit.weight * 2.205) * 0.732) + 8.987 +
      (fit.wrist * 0.394 / 3.14) -
      (fit.waist * 0.394 * 0.157) -
      (fit.hips * 0.394 * 0.249) +
      (fit.forearm * 0.434);
    bodyFatWeight = (fit.weight * 2.205) - leanBodyMass;
    fit.fatPercentage.data = +((bodyFatWeight * 100) / (fit.weight * 2.205)).toFixed(2);
    if (fit.fatPercentage.data < 0) {
      fit.fatPercentage.data = 0
    }
    if (fit.fatPercentage.data > 25 || fit.fatPercentage.data < 10) {
      fit.fatPercentage.normal = false;
    } else {
      fit.fatPercentage.normal = true;
    }
  }

  private setBodyFatMale(fit: Fitness): void {
    let bodyFatWeight: number = 0, leanBodyMass: number = 0;
    leanBodyMass = (fit.weight * 2.205 * 1.082) + 94.42 - (fit.waist * 0.394 * 4.15);
    bodyFatWeight = (fit.weight * 2.205) - leanBodyMass;
    fit.fatPercentage.data = +((bodyFatWeight * 100) / (fit.weight * 2.205)).toFixed(2);
    if (fit.fatPercentage.data > 20 || fit.fatPercentage.data < 2) {
      fit.fatPercentage.normal = false;
    } else {
      fit.fatPercentage.normal = true;
    }
  }

  public getAgeInterval(fit: Fitness): string {
    let interval: string;
    if (fit.infancy) {
      interval = (fit.age <= 6) ? "0-6 months" : "7-12 months";
    } else {
      interval = (fit.age <= 3) ? "1-3 years" :
        (fit.age <= 8) ? "4-8 years" :
          (fit.age <= 13) ? "9-13 years" :
            (fit.age <= 18) ? "14-18 years" :
              (fit.age <= 50) ? "19-50 years" :
                (fit.age <= 70) ? "50-70 years" : "70+ years";
    }

    return interval;
  }

  public setFitness(fit: Fitness): void {
    this.setBMR(fit);
    this.setBMI(fit);
    if (fit.gender === 'male') {
      this.setBodyFatFemale(fit);
    } else {
      this.setBodyFatMale(fit);
    }
  }

}
