// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-detail',
    templateUrl: 'recipe-detail.component.html',
    styleUrls: ['recipe-detail.component.html'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailComponent implements OnInit {
  
    constructor(private _changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this._changeDetectionRef.detectChanges();
    }
}