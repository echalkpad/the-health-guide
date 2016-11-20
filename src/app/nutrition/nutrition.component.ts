import { Component, OnInit } from '@angular/core';

import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent implements OnInit {

  constructor(private loadingSvc: TdLoadingService) { }

  public startLoading(): void {
    this.loadingSvc.register('food.load');
    setTimeout(() => this.loadingSvc.resolve('food.load'), 4000);
  }
  
  ngOnInit() {
  }

}
