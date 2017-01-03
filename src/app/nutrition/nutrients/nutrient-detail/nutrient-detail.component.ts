import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

import { Nutrient } from '../shared/nutrient.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nutrient-detail',
  templateUrl: './nutrient-detail.component.html',
  styleUrls: ['./nutrient-detail.component.scss']
})
export class NutrientDetailComponent implements OnInit {
  public nutrient: Nutrient;
  constructor(
    private _detector: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _titleSvc: Title
  ) { }


  ngOnInit(): void {
    this._route.data.subscribe((data: { nutrient: Nutrient }) => {
      if (!!data) {
        this.nutrient = Object.assign({}, data.nutrient);
        this._titleSvc.setTitle(this.nutrient.name);
        this._detector.markForCheck();
      }
    });
  }

}
