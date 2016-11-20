import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Nutrient } from '../shared/nutrient.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nutrient-detail',
  templateUrl: './nutrient-detail.component.html',
  styleUrls: ['./nutrient-detail.component.scss']
})
export class NutrientDetailComponent implements OnInit {
  public nutrient: Nutrient;
  constructor(private detector: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { nutrient: Nutrient }) => {
      if (!!data) {
        this.nutrient = Object.assign({}, data.nutrient);
        this.detector.markForCheck();
        console.log(this.nutrient);
      }
    });
  }

}
