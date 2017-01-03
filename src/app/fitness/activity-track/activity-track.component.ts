import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TdDialogService, TdLoadingService } from '@covalent/core';

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
  public checkedActivities: HTMLInputElement[] = [];
  public currentDate: string = "";
  public isDirty: boolean = false;
  public searchActivities: boolean = true;
  public selectedActivityTypes: ActivityType[] = [];

  constructor(
    private atSvc: ActivityTrackService,
    private atDataSvc: ActivityTrackDataService,
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
    this.isDirty = true;
    at.activities = [...at.activities, ...this.selectedActivityTypes.map((activity: ActivityType) => Object.assign({}, activity))];
    this.atSvc.setActivityTimeTotal(at);
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public canDeactivate(): Promise<boolean> | boolean {
    if (this.isDirty === false) {
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

  public changeDuration(activityType: ActivityType, at?: ActivityTime): void {
    this.dialogSvc.openPrompt({
      message: 'Enter activity duration in minutes',
      disableClose: true,
      value: '1',
      title: `Enter ${activityType.name}'s duration`,
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        if (typeof +value === 'number') {
          activityType.duration = +value;
          activityType.energyConsumption = Math.floor(activityType.met * +value);
          this.isDirty = true;
          if (at) {
            this.atSvc.setActivityTimeTotal(at);
            this.atSvc.setActivityTrackTotal(this.activityTrack);
          }

        }
      }
    });
  }

  public clearAllSelections(): void {
    this.selectedActivityTypes = [];
    this.checkedActivities.forEach((checkBox: HTMLInputElement) => checkBox.checked = false);
    this.checkedActivities = [];

  }

  public findActivityType(activityType: ActivityType, label: string): null | ActivityType {
    return this.atSvc.searchActivityType(this.selectedActivityTypes, activityType.name, label);
  }

  public removeActivity(activity: ActivityType, at: ActivityTime): void {
    at.activities.splice(at.activities.indexOf(activity), 1);
    this.isDirty = true;
    this.atSvc.setActivityTimeTotal(at);
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public removeActivityTime(at: ActivityTime): void {
    this.activityTrack.activityTimes.splice(this.activityTrack.activityTimes.indexOf(at), 1);
    this.isDirty = true;
    this.atSvc.setActivityTrackTotal(this.activityTrack);
  }

  public syncActivityTrack(): void {
    if (this.isDirty) {
      this.atDataSvc.setActivityTrack(this.activityTrack);
      this.dataSvc.saveActivityTrack(this.activityTrack);
      this.dataSvc.saveEnergyConsumption(this.activityTrack.energyConsumption);
    }
    setTimeout(() => {
      this.atDataSvc.getActivityTrack(this.currentDate).subscribe((at: ActivityTracker) => {
        if (!!at && !!at.hasOwnProperty('date')) {
          this.activityTrack = new ActivityTracker(this.currentDate);
          this.activityTrack = at;
          this.dataSvc.saveActivityTrack(at);
          this.dataSvc.saveEnergyConsumption(this.activityTrack.energyConsumption);
        }
      });
    }, 2000);
    this.isDirty = false;
  }

  public toggleActivity(activityType: ActivityType, label: string, checkbox?: HTMLInputElement): void {
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
            let newActivity: ActivityType = new ActivityType(activityType.name, label, +value, Math.floor(activityType.met * +value), activityType.met);
            this.selectedActivityTypes.push(newActivity);
            if (checkbox) {
              checkbox.checked = true;
              this.checkedActivities.push(checkbox);
            }
          }
        } else if (checkbox) {
          checkbox.checked = false;
          this.checkedActivities.splice(this.checkedActivities.indexOf(checkbox), 1);
        }
      });
    } else {
      let index: number = this.selectedActivityTypes.indexOf(foundActivity);
      this.selectedActivityTypes.splice(index, 1);
      if (!checkbox) {
        this.checkedActivities[index].checked = false;
      }
      this.checkedActivities.splice(index, 1);
    }
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('activity-track.load');
    setTimeout(() => {
      this.loadingSvc.resolve('activity-track.load');
      if (!this.activityTrack.activityTimes.length) {
        this.showAlert("You haven't moved today. Start moving your butt!", "No activity today");
      }
    }, 4000);
    this.titleSvc.setTitle('Activity tracker');
  }

  ngOnInit(): void {
    this.currentDate = this.dataSvc.getCurrentDate();
    this.atDataSvc.getActivities().subscribe((data: Activity[]) => {
      if (!!data && !!data.length) {
        this.activities = [...data];
      }
    });

    this.route.data.subscribe((data: { activityTrack: ActivityTracker }) => this.activityTrack = Object.assign({}, data.activityTrack));
  }

}
