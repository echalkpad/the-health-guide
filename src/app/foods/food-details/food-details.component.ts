// Angular
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// THG
import { Food } from '../shared';

@Component({
  moduleId: module.id,
  selector: 'thg-food-details',
  templateUrl: 'food-details.component.html',
  styleUrls: ['food-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDetailsComponent implements OnDestroy, OnInit {
  public food: Food;
  constructor(
    private _detectorRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._route.data.subscribe((data: { food: Food }) => this.food = data.food);
  }

  ngOnDestroy(): void {
    this._detectorRef.detach();
  }

}
