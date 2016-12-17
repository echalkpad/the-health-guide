import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { TdLoadingService } from '@covalent/core';

import { AuthService } from '../../auth/auth.service';
import { DataService } from '../shared/data.service';
import { Fitness } from '../fitness.model';
import { FitnessService } from '../fitness.service';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-fitness-profile',
  templateUrl: './fitness-profile.component.html',
  styleUrls: ['./fitness-profile.component.scss']
})
export class FitnessProfileComponent implements AfterViewInit, OnInit {
  private userData: User;
  public profile: Fitness;
  constructor(
    private authSvc: AuthService,
    private dataSvc: DataService,
    private fitSvc: FitnessService,
    private loadSvc: TdLoadingService,
    private route: ActivatedRoute,
    private toast: MdSnackBar
  ) { }

  public setFitness(): void {
    this.fitSvc.setFitness(this.profile);
  }

  public saveProfile(): void {
    this.fitSvc.saveProfile(this.profile);
    setTimeout(() => this.toast.open('Update complete!', 'OK'), 3000);
  }

  ngAfterViewInit(): void {
    this.loadSvc.register('profile.load');
    setTimeout(() => this.loadSvc.resolve('profile.load'), 1000);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { profile: Fitness }) => {
      this.profile = data.profile;
      this.loadSvc.resolve('profile.load')
    });
  }

}
