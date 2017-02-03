// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

// Nativescript
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

// THG
import { Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-detail',
    templateUrl: 'recipe-detail.component.html',
    styleUrls: ['recipe-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailComponent {
    public recipe: Recipe;
    public aminoacids: string[];
    public basicNutrition: string[];
    public minerals: string[];
    public vitamins: string[];
    constructor(
        private _detectorRef: ChangeDetectorRef,
        private _params: ModalDialogParams,
        private _recipeDataSvc: RecipeDataService
    ) {
        this.basicNutrition = [
            'Energy',
            'Water',
            'Protein',
            'Carbohydrates',
            'Sugars',
            'Fiber',
            'Fats',
            'Saturated fat',
            'Monounsaturated fat',
            'Polyunsaturated fat',
            'Trans fat'
        ];

        this.recipe = _params.context;
        this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
        this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
        this.minerals = Object.keys(this.recipe.nutrition['minerals']);
    }

    public goBack(): void {
        this._params.closeCallback();
    }
}
