import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { TdDialogService, TdLoadingService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';

import { Auth } from '../../../auth/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { Chef } from '../shared/chef.model';
import { HelperService } from '../../../shared/helper.service';
import { Food } from '../../food/shared/food.model';
import { FoodService } from '../../food/shared/food.service';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';
import { RecipeService } from '../shared/recipe.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
    @ViewChild('recipeForm') recipeForm: FormControl;
    private _foods: Ingredient[] = [];
    private _isDirty: boolean = false;
    private _recipes: Ingredient[] = [];
    public aminoacids: string[] = [];
    public auth: Auth;
    public basicNutrients: string[] = [];
    public categories: string[];
    public cookMethods: string[];
    public currentPage: number = 1;
    public difficulties: string[];
    public filteredIngredients: Ingredient[] = [];
    public filteredTotal: number = 0;
    public ingredients: Ingredient[] = [];
    public instructions: string[] = [];
    public pageSize: number = 10;
    public recipe: Recipe;
    public startPage: number = 1;
    public minerals: string[] = [];
    public vitamins: string[] = [];
    constructor(
        private _authSvc: AuthService,
        private _dialogSvc: TdDialogService,
        private _foodSvc: FoodService,
        private _helperSvc: HelperService,
        private _loadingSvc: TdLoadingService,
        private _recipeDataSvc: RecipeDataService,
        private _recipeSvc: RecipeService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _titleSvc: Title,
        private _toast: MdSnackBar
    ) {

        this.basicNutrients = [
            'Water',
            'Protein',
            'Carbohydrates',
            'Sugars',
            'Fiber',
            'Fats',
            'Saturated fat',
            'Monounsaturated fat',
            'Polyunsaturated fat',
            'Omega-3 fatty acids',
            'Omega-6 fatty acids',
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

    private _showAlert(msg: string | Error, title: string): void {
        this._dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: title,
            closeButton: 'Close'
        });
    }

    public addInstruction(): void {
        this.instructions.push('');
        this.recipe.instructions = [...this.instructions];
        this._isDirty = true;
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (this._isDirty === false || (!this.recipeForm.dirty && this.recipe.ingredients.length === 0 && this.recipe.instructions.length === 0 && this.recipe.image === '')) {
            return true;
        }
        return new Promise(resolve => {
            return this._dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

    public cookRecipe(): void {
        this._isDirty = false;
        this.syncNutrition();
        this.recipe.instructions = [...this.instructions];
        if (this.recipe.image.indexOf('/recipes') === -1) {
            this._recipeDataSvc.downloadImg(this.recipe.image).then((url: string) => this.recipe.image = url);
        }
        setTimeout(() => {
            this._recipeDataSvc.cookRecipe(this.recipe);
            this._toast.open('Cooking done!', 'OK');
            this._router.navigate(['/nutrition/recipes']);
        }, 2000);
    }

    public changeQty(ingredient: Ingredient): void {
        this._dialogSvc.openPrompt({
            message: `Enter the ingredient quantity in ${ingredient.hasOwnProperty('nutrition') ? 'units' : 'grams'}`,
            disableClose: true,
            value: '100',
            title: `Enter ${ingredient.name}'s quantity`,
        }).afterClosed().subscribe((value: string) => {
            if (value) {
                if (typeof +value === 'number') {
                    ingredient.quantity = +value;
                    this.syncNutrition();
                    this._isDirty = true;
                }
            }
        });
    }

    public clearAllSelections(): void {
        this.ingredients = [...this.ingredients, ...this.recipe.ingredients];
        this.recipe.ingredients = [];
        this.filteredIngredients = [...this._helperSvc.sortByName(this.ingredients)];
        this.filter();
        this._isDirty = true;
    }

    public filter(searchTerm: string = ''): void {
        let newData: any[] = this.ingredients;
        newData = this._helperSvc.filterItems(newData, searchTerm);
        this.filteredTotal = newData.length;
        newData = this._helperSvc.paginate(newData, this.startPage, this.currentPage * this.pageSize);
        this.filteredIngredients = newData;
    }

    public page(pagingEvent: IPageChangeEvent): void {
        this.startPage = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    public removeIngredient(ingredient: Ingredient): void {
        this.recipe.ingredients.splice(this.recipe.ingredients.indexOf(ingredient), 1);
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

    public toggleIngredient(ingredient: Ingredient, checkBox?: HTMLInputElement): void {
        this._isDirty = true;
        let idx: number = this.recipe.ingredients.indexOf(ingredient);
        if (idx === -1) {
            this._dialogSvc.openPrompt({
                message: `Enter the meal quantity in ${ingredient.hasOwnProperty('nutrition') ? 'units' : 'grams'}`,
                disableClose: true,
                value: `${ingredient.hasOwnProperty('nutrition') ? '1' : '100'}`,
                title: `Enter ${ingredient.name}'s quantity`,
            }).afterClosed().subscribe((value: string) => {
                if (value) {
                    if (typeof +value === 'number') {
                        ingredient.quantity = +value;
                        if (checkBox) {
                            checkBox.checked = true;
                        }
                        this.syncNutrition();
                        this.recipe.ingredients.push(ingredient);
                        this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
                        this.filter();
                        this.syncNutrition();
                    }
                } else {
                    if (checkBox) {
                        checkBox.checked = false
                    }
                }
            });
        } else {
            this.recipe.ingredients.splice(idx, 1);
            this.ingredients.push(ingredient);
            this.filteredIngredients = [...this._helperSvc.sortByName(this.ingredients)];
            this.filter();
            this.syncNutrition();
        }

    }

    public uploadImage(img: File): void {
        this._recipeDataSvc.uploadImage(img).then(() => {
            this.recipe.image = img.name;
            this._toast.open('Upload complete!', 'OK');
        });
        this._isDirty = true;
    }

    ngAfterViewInit(): void {
        this._loadingSvc.register('ingredients.load');
        setTimeout(() => {
            this.ingredients = [...this._helperSvc.sortByName([...this._foods, ...this._recipes])];
            this.filter();
            this._loadingSvc.resolve('ingredients.load');
        }, 10000);
        this._titleSvc.setTitle(this.recipe.name);
    }

    ngOnInit(): void {
        this.auth = Object.assign({}, this._authSvc.getAuth());
        this._route.data.subscribe((data: { recipe: Recipe }) => {
            this.recipe = Object.assign({}, data.recipe);
            this.instructions = [...this.recipe.instructions];
            this.recipe.chef = new Chef(this.auth.id, this.auth.name, this.auth.avatar);
            console.log(this.recipe);
            this.aminoacids = Object.keys(this.recipe.nutrition['amino acids']);
            this.vitamins = Object.keys(this.recipe.nutrition['vitamins']);
            this.minerals = Object.keys(this.recipe.nutrition['minerals']);
        });


        this._recipeDataSvc.getPrivateRecipes().subscribe((data: Ingredient[]) => {
            if (!!data && !!data.length) {
                if (this.recipe && this.recipe.ingredients.length) {
                    data.forEach((recipe: Recipe, idx: number) => {
                        this.recipe.ingredients.forEach((rcpIngredient: Ingredient) => {
                            if (recipe.name === rcpIngredient.name) {
                                data.splice(idx, 1);
                            }
                        });
                    });
                }
                this._recipes = [...data];
            }
        });

        this._foodSvc.getFoods().subscribe((data: Ingredient[]) => {
            if (!!data && !!data.length) {
                if (this.recipe && this.recipe.ingredients.length) {
                    data.forEach((food: Food, idx: number) => {
                        this.recipe.ingredients.forEach((rcpIngredient: Ingredient) => {
                            if (food.name === rcpIngredient.name) {
                                data.splice(idx, 1);
                            }
                        });
                    });
                }
                this._foods = [...data]
            }
        });
    }

}
