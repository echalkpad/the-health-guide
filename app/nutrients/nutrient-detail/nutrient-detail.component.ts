import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'thg-nutrient-detail',
  templateUrl: 'nutrient-detail.component.html',
  styleUrls: ['nutrient-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NutrientDetailComponent implements OnInit {
  
  constructor(private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeDetectionRef.detectChanges();
  }
}