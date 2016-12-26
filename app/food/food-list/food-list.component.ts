import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { DrawerService } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-food',
  templateUrl: 'food-list.component.html',
  styleUrls: ['food-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodListComponent implements OnInit {
  constructor(private changeDetectionRef: ChangeDetectorRef, public drawerSvc: DrawerService) { }

  ngOnInit(): void {
    this.changeDetectionRef.detectChanges();
  }
}