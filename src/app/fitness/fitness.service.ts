import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Auth } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { DataService } from './shared/data.service';
import { Fitness } from './fitness.model';
import { HelperService } from '../shared/helper.service';
import { User } from '../auth/user.model';

@Injectable()
export class FitnessService {
  private profile: FirebaseObjectObservable<Fitness>;
  constructor(
    private af: AngularFire,
    private authSvc: AuthService,
    private dataSvc: DataService,
    private helperSvc: HelperService
  ) {
    this.profile = af.database.object(`/fitness/${authSvc.getAuth().id}`);
  }

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
    fit.fatPercentage.data = Math.round(
      (495 / (1.29579 - 0.35004 * this.helperSvc.log10(fit.waist + fit.hips - fit.neck) + 0.22100 * this.helperSvc.log10(fit.height)) - 450) * 10
    ) / 10;
    if (fit.fatPercentage.data > 25 || fit.fatPercentage.data < 10) {
      fit.fatPercentage.normal = false;
    } else {
      fit.fatPercentage.normal = true;
    }
  }

  private setBodyFatMale(fit: Fitness): void {
    fit.fatPercentage.data = Math.round(
      (495 / (1.0324 - 0.19077 * this.helperSvc.log10(fit.waist - fit.neck) + 0.15456 * this.helperSvc.log10(fit.height)) - 450) * 10
    ) / 10;
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

  public getProfile(): FirebaseObjectObservable<Fitness> {
    return this.profile;
  }

  public saveProfile(profile: Fitness): void {
    let user: User = this.dataSvc.getUser();
    user.age = profile.age;
    user.gender = profile.gender;
    user.height = profile.height;
    user.weight = profile.weight;
    user.infancy = profile.infancy;
    user.lactation = profile.lactation;
    user.pregnancy = profile.pregnancy;
    this.authSvc.saveUserData(this.authSvc.getAuth().id, user);
    if (profile.hasOwnProperty('$key')) {
      delete profile['$key'];
      delete profile['$exists'];
      this.getProfile().update(profile);
    } else {
      this.getProfile().set(profile);
    }
  }

  public setFitness(fit: Fitness): void {
    this.setBMR(fit);
    this.setBMI(fit);
    if (fit.gender === 'female') {
      this.setBodyFatFemale(fit);
    } else {
      this.setBodyFatMale(fit);
    }
  }

}
