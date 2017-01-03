import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { TdDialogService, TdLoadingService } from '@covalent/core';

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
  private _isDirty: boolean = false;
  public profile: Fitness;
  constructor(
    private _authSvc: AuthService,
    private _dataSvc: DataService,
    private _dialogSvc: TdDialogService,
    private _fitSvc: FitnessService,
    private loadSvc: TdLoadingService,
    private _route: ActivatedRoute,
    private _toast: MdSnackBar
  ) { }

  public canDeactivate(): Promise<boolean> | boolean {
        if (this._isDirty === false) {
            return true;
        }
        return new Promise(resolve => {
            return this._dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

  public setFitness(): void {
    this._isDirty = true;
    this._fitSvc.setFitness(this.profile);
  }

  public saveProfile(): void {
    this._fitSvc.saveProfile(this.profile);
    this._isDirty = false;
    setTimeout(() => this._toast.open('Update complete!', 'OK'), 3000);
  }

  ngAfterViewInit(): void {
    this.loadSvc.register('profile.load');
    setTimeout(() => this.loadSvc.resolve('profile.load'), 1000);
  }

  ngOnInit(): void {
    this._route.data.subscribe((data: { profile: Fitness }) => {
      this.profile = data.profile;
      this.loadSvc.resolve('profile.load')
    });
  }

}
