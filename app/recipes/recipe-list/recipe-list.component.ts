import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { DrawerService } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-recipes',
  templateUrl: 'recipe-list.component.html',
  styleUrls: ['recipe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent implements OnInit {

  constructor(private changeDetectionRef: ChangeDetectorRef, public drawerSvc: DrawerService) { }

  ngOnInit(): void {
    this.changeDetectionRef.detectChanges();
  }
}