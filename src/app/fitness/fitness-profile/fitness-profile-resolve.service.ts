import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { DataService } from '../shared/data.service';
import { Fitness } from '../fitness.model';
import { FitnessService } from '../fitness.service';

@Injectable()
export class FitnessProfileResolve implements Resolve<Fitness> {

  constructor(
    private dataSvc: DataService,
    private fitSvc: FitnessService
  ) { }

  public resolve(route: ActivatedRouteSnapshot): Promise<Fitness> {
    return new Promise(resolve => {
      if (!this.dataSvc.getFitness()) {
        this.fitSvc.getProfile().subscribe((profile: Fitness) => {
          if (!!profile) {
            resolve(profile);
          }
        });
      } else {
        resolve(this.dataSvc.getFitness());
      }
    });
  }
}
