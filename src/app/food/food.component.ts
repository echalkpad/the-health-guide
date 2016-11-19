import { Component } from '@angular/core';

import { TdLoadingService } from '@covalent/core';

@Component({
  templateUrl: 'food.component.html'
})
export class FoodComponent {
  constructor(private loadingSvc: TdLoadingService) { }
  
  public startLoading(): void {
    this.loadingSvc.register('food.load');
    setTimeout(() => this.loadingSvc.resolve('food.load'), 4000);
  }
}
