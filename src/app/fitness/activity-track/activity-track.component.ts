import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TdDialogService } from '@covalent/core';

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
  public activities: ActivityType[] = [];
  public auth: Auth;
  public currentDate: string = "";
  public filteredActivities: ActivityType[] = [];
  public filteredTotal: number = 0;
  public activityTrack: ActivityTracker = new ActivityTracker();
  public searchActivities: boolean = true;
  public selectedAvailableActivities: Activity[] = [];

  constructor(
    private atSvc: ActivityTrackService,
    private atDataSvc: ActivityTrackDataService,
    private authSvc: AuthService,
    private dataSvc: DataService,
    private dialogSvc: TdDialogService,
    private helperSvc: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private titleSvc: Title
  ) { }

  private showAlert(msg: string | Error): void {
    this.dialogSvc.openAlert({
      message: msg.toString(),
      disableClose: false,
      title: 'An error has occured',
      closeButton: 'Close'
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
      }
    });
  }

  public syncActivityTrack(): void {
    this.atDataSvc.setActivityTrack(this.auth.id, this.activityTrack);
    this.dataSvc.saveActivityTrack(this.activityTrack);
  }

  ngOnInit(): void {
    this.auth = Object.assign({}, this.authSvc.getAuthData());
    this.currentDate = this.dataSvc.getCurrentDate();
    this.atDataSvc.getActivities().subscribe((data: ActivityType[]) => {
      if (!!data && !!data.length) {
        this.activities = [...data];
      }
    });

    this.route.data.subscribe((data: { activityTrack: ActivityTracker }) => this.activityTrack = Object.assign({}, data.activityTrack));
    this.titleSvc.setTitle('Fitness');
}

}
