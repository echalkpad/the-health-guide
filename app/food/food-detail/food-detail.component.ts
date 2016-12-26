import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'thg-food-detail',
  templateUrl: 'food-detail.component.html',
  styleUrls: ['food-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailComponent implements OnInit {
  
  constructor(private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.changeDetectionRef.detectChanges();
  }
}