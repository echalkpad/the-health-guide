// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from 'ui/dialogs';
import { setTimeout } from 'timer';

// THG
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
    moduleId: module.id,
    selector: 'thg-recipe-edit',
    templateUrl: 'recipe-edit.component.html',
    styleUrls: ['recipe-edit.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeEditComponent implements OnInit {
    private _foods: Ingredient[] = [];
    private _isDirty: boolean = false;
    private _recipes: Ingredient[] = [];
    public aminoacids: string[] = [];
    public basicNutrition: string[] = [];
    public categories: string[];
    public cookMethods: string[];
    public difficulties: string[];
    public filteredIngredients: Ingredient[] = [];
    public filteredTotal: number = 0;
    public ingredients: Ingredient[] = [];
    public instructions: string[] = [];
    public recipe: Recipe;
    public recipeForm: FormGroup;
    public minerals: string[] = [];
    public vitamins: string[] = [];
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _helperSvc: HelperService,
        private _recipeSvc: RecipeDataService,
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

        this.categories = [
            'Appetizers',
            'Beverages',
            'Breakfasts',
            'Casserolles',
            'Desserts',
            'Holidays',
            'Main dishes',
            'Salads',
            'Sandwiches',
            'Sauces',
            'Side dishes',
            'Soups'
        ];

        this.cookMethods = [
            'Baking',
            'Blanching',
            'Boiling',
            'Braising',
            'Freezing',
            'Frying',
            'Grilling',
            'Microwaving',
            'Pasteurization',
            'Pickling',
            'Poaching',
            'Raw',
            'Sauteing',
            'Simmering',
            'Slow cooking',
            'Smoking',
            'Steaming'
        ];

        this.difficulties = [
            'Easy',
            'Intermidiate',
            'Advanced',
            'Master chef'
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
        this.recipeForm = this._fb.group({
            name: [this.recipe.name, [Validators.required, Validators.maxLength(20)]],
            description: [this.recipe.description, [Validators.required, Validators.maxLength(100)]],
            cookTemperature: [this.recipe.cookTemperature, [Validators.required]]
        });
        this._changeDetectionRef.detectChanges();
    }

}
