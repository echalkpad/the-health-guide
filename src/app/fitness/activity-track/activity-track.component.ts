import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TdDialogService, TdLoadingService } from '@covalent/core';

import { Auth } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../shared/data.service';
import { HelperService } from '../../shared/helper.service';
import { Activity, ActivityTime, ActivityTracker, ActivityType } from './activity-tracker.model';
import { ActivityTrackDataService } from './activity-track-data.service';
import { ActivityTrackService } from './activity-track.service';

@Component({
  selector: 'app-activity-track',
  templateUrl: './activity-track.component.html',
  styleUrls: ['./activity-track.component.scss']
})
export class ActivityTrackComponent implements OnInit {
  public activities: Activity[] = [];
  public activityTrack: ActivityTracker = new ActivityTracker();
  public auth: Auth;
  public currentDate: string = "";
  public dirty: boolean = false;
  public searchActivities: boolean = true;
  public selectedActivityTypes: ActivityType[] = [];

  constructor(
    private atSvc: ActivityTrackService,
    private atDataSvc: ActivityTrackDataService,
    private authSvc: AuthService,
    private dataSvc: DataService,
    private dialogSvc: TdDialogService,
    private helperSvc: HelperService,
    private loadingSvc: TdLoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private titleSvc: Title
  ) { }

  private showAlert(msg: string | Error, title: string): void {
    this.dialogSvc.openAlert({
      message: msg.toString(),
      disableClose: false,
      title: title,
      closeButton: 'Close'
    });
  }

  public addActivityTime(): void {
    this.dirty = true;
    let date: Date = new Date();
    this.dialogSvc.openPrompt({
      message: 'Format: hh:mm',
      disableClose: true,
      value: `${date.getHours()}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()}`,
      title: 'Enter a time',
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        this.activityTrack.activityTimes.push(new ActivityTime(value));
      }
    });
  }

  public addSelectedActivities(at: ActivityTime): void {
    at.activities = [...at.activities, ...this.selectedActivityTypes];
    this.atSvc.setActivityTimeTotal(at);
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public canDeactivate(): Promise<boolean> | boolean {
    if (!this.dirty) {
      return true;
    }
    return new Promise(resolve => {
      return this.dialogSvc.openConfirm({
        message: 'Changes have been made! Are you sure you want to leave?',
        disableClose: true,
        title: 'Discard changes',
        cancelButton: 'Disagree',
        acceptButton: 'Agree',
      }).afterClosed().subscribe((agree: boolean) => resolve(agree));
    });
  }

  public changeDate(): void {
    this.dialogSvc.openPrompt({
      message: 'Format: dd/MM/YYYY',
      disableClose: true,
      value: this.currentDate,
      title: 'Enter a date',
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        this.currentDate = value;
        this.syncActivityTrack();
      }
    });
  }

  public findActivityType(activityType: ActivityType, label: string): null | ActivityType {
    return this.atSvc.searchActivityType(this.selectedActivityTypes, activityType.name, label);
  }

  public removeActivity(activity: ActivityType, at: ActivityTime): void {
    this.dirty = true;
    at.activities.splice(at.activities.indexOf(activity), 1);
    this.atSvc.setActivityTimeTotal(at);
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public removeActivityTime(at: ActivityTime): void {
    this.dirty = true;
    this.activityTrack.activityTimes.splice(this.activityTrack.activityTimes.indexOf(at), 1);
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public syncActivityTrack(): void {
    this.loadingSvc.register('activity-track.load');
    if (this.dirty) {
      this.atDataSvc.setActivityTrack(this.auth.id, this.activityTrack);
      this.dataSvc.saveActivityTrack(this.activityTrack);
      this.dataSvc.saveEnergyConsumption(this.activityTrack.energyConsumption);
      this.dirty = false;
    }
    this.atDataSvc.getActivityTrack(this.auth.id, this.currentDate).subscribe((at: ActivityTracker) => {
      if (!!at && !!at.hasOwnProperty('date')) {
        this.activityTrack = at;
        this.dataSvc.saveActivityTrack(at);
        this.dataSvc.saveEnergyConsumption(this.activityTrack.energyConsumption);
        this.loadingSvc.resolve('activity-track.load');
      }
    });
  }

  public toggleActivity(activityType: ActivityType, label: string, checkbox?: any): void {
    this.dirty = true;
    let foundActivity: null | ActivityType = this.findActivityType(activityType, label);
    if (!foundActivity) {
      this.dialogSvc.openPrompt({
        message: 'Enter activity duration in minutes',
        disableClose: true,
        value: '1',
        title: `Enter ${activityType.name}'s duration`,
      }).afterClosed().subscribe((value: string) => {
        if (value) {
          if (typeof +value === 'number') {
            let newActivity: ActivityType = new ActivityType(activityType.name, label, +value, Math.floor(activityType.met * +value));
            this.selectedActivityTypes.push(newActivity);
            if (checkbox) {
              checkbox.checked = true;
            }
          }
        } else if (checkbox) {
          checkbox.checked = false;
        }
      });
    } else {
      this.selectedActivityTypes.splice(
        this.selectedActivityTypes.indexOf(foundActivity), 1
      );
    }
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('activities.load');
    this.loadingSvc.register('activity-track.load');
    setTimeout(() => {
      this.loadingSvc.resolve('activities.load');
      this.loadingSvc.resolve('activity-track.load');
      if (!this.activityTrack.activityTimes.length) {
        this.showAlert("You haven't moved today. Start moving your butt!", "No activity today");
      }
    }, 4000);
    this.titleSvc.setTitle('Activity tracker');
  }

  ngOnInit(): void {
    this.auth = Object.assign({}, this.authSvc.getAuthData());
    this.currentDate = this.dataSvc.getCurrentDate();
    this.atDataSvc.getActivities().subscribe((data: Activity[]) => {
      if (!!data && !!data.length) {
        this.activities = [...data];
      }
    });

    this.route.data.subscribe((data: { activityTrack: ActivityTracker }) => this.activityTrack = Object.assign({}, data.activityTrack));
  }

}
