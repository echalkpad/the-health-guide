import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nutrition-info',
  templateUrl: './nutrition-info.component.html',
  styleUrls: ['./nutrition-info.component.scss']
})
export class NutritionInfoComponent implements OnInit {

  constructor(private _changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._changeDetectionRef.detach();
  }

}
