import { Component, OnInit } from '@angular/core';

import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit {
  public pageTitle: string = "Nutrition";
  constructor() { }

  public changeTitle(title: string): void {
    this.pageTitle = title;
  }

  ngOnInit(): void {
  }

}
