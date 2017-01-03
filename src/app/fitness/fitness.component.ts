import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { DataService } from './shared/data.service';
import { Fitness } from './fitness.model';
import { FitnessService } from './fitness.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-fitness',
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.scss']
})
export class FitnessComponent implements OnInit {
  public pageTitle: string = "Fitness";
  constructor(private _authSvc: AuthService, private _dataSvc: DataService, private _fitSvc: FitnessService) { }

  public changeTitle(title: string): void {
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this._authSvc.getUserData(this._authSvc.getAuth().id).subscribe((user: User) => {
      let fitness: Fitness = new Fitness();
      fitness.age = user.age;
      fitness.gender = user.gender;
      fitness.height = user.height;
      fitness.infancy = user.infancy;
      fitness.lactation = user.lactation;
      fitness.pregnancy = user.pregnancy;
      fitness.weight = user.weight;
      fitness.ageInterval = this._fitSvc.getAgeInterval(fitness);
      this._fitSvc.setFitness(fitness);
      this._fitSvc.saveProfile(fitness);
      this._dataSvc.saveFitness(fitness);
      this._dataSvc.saveUser(user);
    });
  }

}
