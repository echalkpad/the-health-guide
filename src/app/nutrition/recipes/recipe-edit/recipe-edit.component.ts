import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

import { Food } from '../../food/shared/food.model';
import { FoodService } from '../../food/shared/food.service';
import { Ingredient, Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  public categories: string[];
  public cookMethods: string[];
  public difficulties: string[];
  public ingredients: string[] = [];
  public selectedIngredients: Ingredient[] = [];
  public recipe: Recipe;
  public tags: string[];
  constructor(
    private detector: ChangeDetectorRef,
    private foodSvc: FoodService,
    public recipeSvc: RecipeService,
    private route: ActivatedRoute,
    private titleSvc: Title
  ) {

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
      "Frying",
      "Grilling",
      "Microwave cooking",
      "No cooking",
      "Pasteurization",
      "Pickling",
      "Poaching",
      "Sauteing",
      "Seasoning",
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
      "Gluten-free",
      "High-fiber",
      "High-protein",
      "Low-carb",
      "Low-fat",
      "Mediteranean",
      "Vegetarian"
    ];
  }

  public uploadImage(img: File): void {
    this.recipeSvc.uploadImage(img);
  }

  ngOnInit(): void {
    this.foodSvc.getFoods().subscribe((data: Ingredient[]) => {
      if (!!data && !!data.length) {
        this.ingredients = [...data.map((item: Ingredient) => item.name)];
      }
    });
    this.route.data.subscribe((data: { recipe: Recipe }) => {
      if (!!data) {
        this.recipe = Object.assign({}, data.recipe);
        console.log(this.recipe);
        this.titleSvc.setTitle(this.recipe.name);
        this.detector.markForCheck();
      }
    });
  }

}
