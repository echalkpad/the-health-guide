// Angular
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';

// Nativescript
import { RouterExtensions } from 'nativescript-angular/router';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import * as dialogs from 'ui/dialogs';
import { setTimeout } from 'timer';

// THG
import { HelperService } from '../../shared';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { MealSearchComponent } from '../../meal-search';
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
    public minerals: string[] = [];
    public recipe: Recipe;
    public selectedCategory: number;
    public selectedCookMethod: number = 0;
    public selectedDifficulty: number;
    public tabIdx: number = 0;
    public vitamins: string[] = [];
    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private _helperSvc: HelperService,
        private _modalSvc: ModalDialogService,
        private _recipeSvc: RecipeService,
        private _recipeDataSvc: RecipeDataService,
        private _route: ActivatedRoute,
        private _router: RouterExtensions,
        private _viewRef: ViewContainerRef
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

    private _showAlert(title: string, msg: string | Error): void {
        let options: dialogs.AlertOptions = {
            title: title,
            message: msg.toString(),
            okButtonText: 'Ok'
        };

        dialogs.alert(options).then(() => console.log('Dialog closed'));
    }

    public addIngredients(): void {
        let options: ModalDialogOptions = {
            viewContainerRef: this._viewRef,
            context: {
                meals: this.recipe.ingredients
            },
            fullscreen: true
        };

        this._modalSvc.showModal(MealSearchComponent, options)
            .then((ingredients: Ingredient[]) => {
                this.recipe.ingredients = [...ingredients];
                this._isDirty = true;
            });
    }

    public addInstruction(): void {
        this.recipe.instructions.push('');
        this._isDirty = true;
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (!this._isDirty && !!this.recipe.ingredients.length && !!this.recipe.instructions.length && !!this.recipe.image) {
            return true;
        }
        return new Promise(resolve => {
            dialogs.confirm({
                title: 'Race selection',
                message: 'Changes have been made! Are you sure you want to leave?',
                okButtonText: 'Agree',
                cancelButtonText: 'Disagree'
            }).then((result: boolean) => {
                resolve(result);
            });
        });
    }

    public changeDetail(detail: string): void {
        let options: dialogs.ActionOptions | dialogs.PromptOptions;
        switch (detail) {
            case 'name':
                options = {
                    title: 'Recipe name',
                    defaultText: this.recipe.name,
                    inputType: dialogs.inputType.text,
                    okButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                };
                dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                    if (result.result) {
                        this.recipe.name = result.text;
                        this._changeDetectionRef.detectChanges();
                        this._changeDetectionRef.markForCheck();
                        this._isDirty = true;
                    }
                });
                break;
            case 'description':
                options = {
                    title: 'Recipe description',
                    defaultText: this.recipe.description,
                    inputType: dialogs.inputType.text,
                    okButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                };
                dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                    if (result.result) {
                        this.recipe.description = result.text;
                        this._changeDetectionRef.detectChanges();
                        this._changeDetectionRef.markForCheck();
                        this._isDirty = true;
                    }
                });
                break;
            case 'difficulty':
                options = {
                    title: 'Recipe difficulty',
                    message: 'Choose the cooking difficulty',
                    cancelButtonText: 'Cancel',
                    actions: [...this.difficulties]
                };
                dialogs.action(options).then((result: string) => {
                    if (result !== 'Cancel') {
                        this.recipe.difficulty = result;
                        this._changeDetectionRef.detectChanges();
                        this._changeDetectionRef.markForCheck();
                        this._isDirty = true;
                    }
                });
                break;
            case 'cookMethod':
                options = {
                    title: 'Recipe cook method',
                    message: 'Choose the cooking method',
                    cancelButtonText: 'Cancel',
                    actions: [...this.cookMethods]
                };
                dialogs.action(options).then((result: string) => {
                    if (result !== 'Cancel') {
                        this.recipe.cookMethod = result;
                        this._changeDetectionRef.detectChanges();
                        this._changeDetectionRef.markForCheck();
                        this._isDirty = true;
                    }
                });
                break;
            case 'category':
                options = {
                    title: 'Recipe category',
                    message: 'Choose the recipe category',
                    cancelButtonText: 'Cancel',
                    actions: [...this.categories]
                };
                dialogs.action(options).then((result: string) => {
                    if (result !== 'Cancel') {
                        this.recipe.category = result;
                        this._changeDetectionRef.detectChanges();
                        this._changeDetectionRef.markForCheck();
                        this._isDirty = true;
                    }
                });
                break;

            default:
                break;
        }
    }

    public goBack(): void {
        this._router.back();
    }

    public removeIngredient(index: number): void {
        this.recipe.ingredients.splice(index, 1);
        this.syncNutrition();
        this._isDirty = true;
    }

    public removeInstruction(index: number) {
        this.instructions.splice(index, 1);
        this.recipe.instructions = [...this.instructions];
        this._isDirty = true;
    }

    public syncNutrition(): void {
        this._recipeSvc.setRecipeNutrition(this.recipe);
    }

    public removeRecipe(): void {
        this._recipeDataSvc.removeRecipe(this.recipe).then(() => {
            let navExtras: NavigationExtras = {
                queryParams: { refresh: true }
            };
            this._isDirty = false;
            this._router.navigate(['/recipes'], navExtras);
        }).catch((err: Error) => this._showAlert('Something went wrong', err));
    }

    public updateRecipe(): void {
        this._recipeDataSvc.updateRecipe(this.recipe).then(() => {
            let navExtras: NavigationExtras = {
                queryParams: { refresh: true }
            };
            this._isDirty = false;
            this._router.navigate(['/recipes'], navExtras);
        }).catch((err: Error) => this._showAlert('Something went wrong', err));
    }

    ngOnInit(): void {
        this._route.queryParams.subscribe((params: Params) => {
            this.recipe = JSON.parse(params['recipe']);
            this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
            this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
            this.minerals = Object.keys(this.recipe.nutrition['minerals']);
        });

    }

}
