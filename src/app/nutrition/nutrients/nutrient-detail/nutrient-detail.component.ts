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
    private detector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) { }


  ngOnInit(): void {
    this.route.data.subscribe((data: { nutrient: Nutrient }) => {
      if (!!data) {
        this.nutrient = Object.assign({}, data.nutrient);
        this.titleSvc.setTitle(this.nutrient.name);
        this.detector.markForCheck();
        console.log(this.nutrient);
      }
    });
  }

}
