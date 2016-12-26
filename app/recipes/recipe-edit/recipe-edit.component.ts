import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-edit',
    templateUrl: 'recipe-edit.component.html',
    styleUrls: ['recipe-edit.component.html'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeEditComponent implements OnInit {

    constructor(private changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.changeDetectionRef.detectChanges();
    }
}