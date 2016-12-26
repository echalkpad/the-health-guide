import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { DrawerService } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-nutrients',
  templateUrl: 'nutrient-list.component.html',
  styleUrls: ['nutrient-list.component.css']
})
export class NutrientListComponent implements OnInit {

  constructor(private changeDetectionRef: ChangeDetectorRef, public drawerSvc: DrawerService) { }

  ngOnInit(): void {
    this.changeDetectionRef.detectChanges();
  }
}