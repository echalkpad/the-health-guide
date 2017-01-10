// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';

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
export class RecipeDetailComponent implements OnInit {
    public recipe: Recipe;
    public aminoacids: string[] = [];
    public basicNutrition: string[] = [];
    public minerals: string[] = [];
    public vitamins: string[] = [];
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _recipeDataSvc: RecipeDataService,
        private _router: RouterExtensions
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
    }

    public goBack(): void {
        this._router.back();
    }

    ngOnInit(): void {
        this.recipe = this._recipeDataSvc.getRecipe();
        this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
        this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
        this.minerals = Object.keys(this.recipe.nutrition['minerals']);
        this._changeDetectionRef.detectChanges();
    }

}
