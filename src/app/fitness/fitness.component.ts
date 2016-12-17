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
  constructor(private authSvc: AuthService, private dataSvc: DataService, private fitSvc: FitnessService) { }

  public changeTitle(title: string): void {
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.authSvc.getUserData(this.authSvc.getAuthData().id).subscribe((user: User) => {
      let fitness: Fitness = new Fitness();
      fitness.age = user.age;
      fitness.gender = user.gender;
      fitness.height = user.height;
      fitness.infancy = user.infancy;
      fitness.lactation = user.lactation;
      fitness.pregnancy = user.pregnancy;
      fitness.weight = user.weight;
      fitness.ageInterval = this.fitSvc.getAgeInterval(fitness);
      this.fitSvc.setFitness(fitness);
      this.fitSvc.saveProfile(fitness);
      this.dataSvc.saveFitness(fitness);
      this.dataSvc.saveUser(user);
    });
  }

}
