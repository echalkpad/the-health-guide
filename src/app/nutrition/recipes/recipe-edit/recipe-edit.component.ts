import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
    public aminoacids: string[] = [];
    public auth: Auth;
    public basicNutrients: string[] = [];
    public categories: string[];
    public cookMethods: string[];
    public currentPage: number = 1;
    public doneEditing: boolean = false;
    public difficulties: string[];
    public filteredIngredients: Ingredient[] = [];
    public filteredTotal: number = 0;
    public ingredients: Ingredient[] = [];
    public instructions: string[] = [];
    public pageSize: number = 10;
    public recipe: Recipe;
    public startPage: number = 1;
    public tags: string[];
    public minerals: string[] = [];
    public vitamins: string[] = [];
    constructor(
        private authSvc: AuthService,
        private dialogSvc: TdDialogService,
        private foodSvc: FoodService,
        private helperSvc: HelperService,
        private loadingSvc: TdLoadingService,
        public recipeDataSvc: RecipeDataService,
        public recipeSvc: RecipeService,
        private route: ActivatedRoute,
        private router: Router,
        private titleSvc: Title
    ) {

        this.basicNutrients = [
            "Water",
            "Protein",
            "Carbohydrates",
            "Sugars",
            "Fiber",
            "Fats",
            "Saturated fat",
            "Monounsaturated fat",
            "Polyunsaturated fat",
            "Trans fat"
        ];

        this.categories = [
            "Appetizers",
            "Beverages",
            "Breakfasts",
            "Casserolles",
            "Desserts",
            "Holidays",
            "Main dishes",
            "Salads",
            "Sandwiches",
            "Sauces",
            "Side dishes",
            "Soups"
        ];

        this.cookMethods = [
            "Baking",
            "Boiling",
            "Braising",
            "Freezing",
            "Frying",
            "Grilling",
            "Microwaving",
            "Pasteurization",
            "Pickling",
            "Poaching",
            "Raw",
            "Sauteing",
            "Simmering",
            "Slow cooking",
            "Smoking",
            "Steaming"
        ];

        this.difficulties = [
            "Easy",
            "Intermidiate",
            "Advanced",
            "Master chef"
        ];

        this.tags = [
            "Dairy-free",
            "Gluten-free",
            "High-calorie",
            "High-carb",
            "High-fat (bad)",
            "High-fat (good)",
            "High-fiber",
            "High-protein",
            "High-sugar",
            "Low-calorie",
            "Low-carb",
            "Low-fat (bad)",
            "Low-fat (good)",
            "Lof-fiber",
            "Low-protein",
            "Low-sugar",
            "Mediteranean",
            "Soy-free",
            "Vegan",
            "Vegetarian"
        ];
    }

    public addInstruction(): void {
        this.instructions.push('');
        this.recipe.instructions = [...this.instructions];
    }

    public canDeactivate(): Promise<boolean> | boolean {
        if (this.doneEditing || (!this.recipeForm.dirty && this.recipe.ingredients.length === 0 && this.recipe.instructions.length === 0 && this.recipe.image === "")) {
            return true;
        }
        return new Promise(resolve => {
            return this.dialogSvc.openConfirm({
                message: 'Changes have been made! Are you sure you want to leave?',
                disableClose: true,
                title: 'Discard changes',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => resolve(agree));
        });
    }

    public cookRecipe(): void {
        if (this.recipe.image === "") {
            this.dialogSvc.openConfirm({
                message: 'Are you sure you want to proceed?',
                disableClose: true,
                title: 'No image uploaded',
                cancelButton: 'Disagree',
                acceptButton: 'Agree',
            }).afterClosed().subscribe((agree: boolean) => {
                if (!!agree) {
                    this.doneEditing = true;
                    this.syncNutrition();
                    this.recipe.instructions = [...this.instructions];
                    if (this.recipe.hasOwnProperty('$key')) {
                        this.recipeDataSvc.updateRecipe(this.recipe);
                    } else {
                        this.recipeDataSvc.addRecipe(this.recipe);
                    }
                    this.router.navigate(['/nutrition/recipes']);
                }
            });
        } else {
            this.doneEditing = true;
            this.syncNutrition();
            this.recipe.instructions = [...this.instructions];
            if (this.recipe.hasOwnProperty('$key')) {
                this.recipeDataSvc.updateRecipe(this.recipe);
            } else {
                this.recipeDataSvc.addRecipe(this.recipe);
            }
            this.router.navigate(['/nutrition/recipes']);
        }
    }

    public changeQty(ingredient: Ingredient, notRemove?: boolean): void {
        let index: number = this.recipe.ingredients.indexOf(ingredient);
        if (notRemove || index === -1) {
            this.dialogSvc.openPrompt({
                message: `Enter the ingredient quantity in ${ingredient.hasOwnProperty('chef') ? 'units' : 'grams'}`,
                disableClose: true,
                value: "100",
                title: `Enter ${ingredient.name}'s quantity`,
            }).afterClosed().subscribe((value: string) => {
                if (value) {
                    if (typeof +value === 'number') {
                        ingredient.quantity = +value;
                        if (index === -1) {
                            this.recipe.ingredients.push(ingredient);
                            this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
                        }
                        this.filter();
                        this.syncNutrition();
                    }
                }
            });
        } else {
            this.recipe.ingredients.splice(index, 1);
            this.ingredients.push(ingredient);
            this.ingredients = [...this.helperSvc.sortByName(this.ingredients)];
            this.filter();
            this.syncNutrition();
        }
    }

    private filter(searchTerm: string = ''): void {
        let newData: any[] = this.ingredients;
        newData = this.recipeSvc.filterIngredients(newData, searchTerm);
        this.filteredTotal = newData.length;
        newData = this.helperSvc.paginate(newData, this.startPage, this.currentPage * this.pageSize);
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
    }

    public removeInstruction(index: number) {
        this.instructions.splice(index, 1);
        this.recipe.instructions = [...this.instructions];
    }

    private showAlert(msg: string | Error, title: string): void {
        this.dialogSvc.openAlert({
            message: msg.toString(),
            disableClose: false,
            title: title,
            closeButton: 'Close'
        });
    }

    public syncNutrition(): void {
        this.recipeSvc.setRecipeNutrition(this.recipe);
    }

    public uploadImage(img: File): void {
        this.recipeDataSvc.uploadImage(img).then((snapshot: firebase.storage.UploadTaskSnapshot) => {
            this.recipeDataSvc.downloadImg(img.name)
                .then((url: string) => this.recipe.image = url)
                .catch((err: Error) => this.showAlert(err, 'An error has occured'));
        });
    }

    ngAfterViewInit(): void {
        this.loadingSvc.register('ingredients.load');
        setTimeout(() => this.loadingSvc.resolve('ingredients.load'), 3000);
        this.titleSvc.setTitle(this.recipe.name);
    }

    ngOnInit(): void {
        this.auth = Object.assign({}, this.authSvc.getAuthData());
        this.foodSvc.getFoods().subscribe((data: Ingredient[]) => {
            if (!!data && !!data.length) {
                this.ingredients = [...data];
                this.filteredIngredients = [...data];
                this.filter();
            }
        });
        this.route.data.subscribe((data: { recipe: Recipe }) => {
            if (!!data) {
                this.recipe = Object.assign({}, data.recipe);
                this.ingredients.forEach((ingredient: Ingredient, idx: number) => {
                    this.recipe.ingredients.forEach((rcpIngredient: Ingredient) => {
                        if (ingredient.name === rcpIngredient.name) {
                            this.ingredients.splice(idx, 1);
                            return;
                        }
                    });
                });

                this.instructions = [...this.recipe.instructions];
                this.recipe.chef = new Chef(this.auth.id, this.auth.name, this.auth.avatar);
                console.log(this.recipe);
                for (let prop in this.recipe.nutrition['amino acids']) {
                    this.aminoacids.push(prop);
                }
                for (let prop in this.recipe.nutrition['vitamins']) {
                    this.vitamins.push(prop);
                }
                for (let prop in this.recipe.nutrition['minerals']) {
                    this.minerals.push(prop);
                }
            }
        });
    }

}
