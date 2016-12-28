import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from '@angular/router';

import { Nutrient } from '../shared/nutrient.model';

@Component({
  moduleId: module.id,
  selector: 'thg-nutrient-detail',
  templateUrl: 'nutrient-detail.component.html',
  styleUrls: ['nutrient-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientDetailComponent implements OnInit {
  public nutrient: Nutrient;
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public goBack(): void {
    this.router.navigate(['/nutrients']);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { nutrient: Nutrient }) => {
      this.nutrient = data.nutrient;
      this.changeDetectionRef.detectChanges();
    });
  }
}