import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { DrawerService } from '../../shared';
import { Recipe } from '../shared/recipe.model';
import { RecipeDataService } from '../shared/recipe-data.service';

@Component({
  moduleId: module.id,
  selector: 'thg-recipes',
  templateUrl: 'recipe-list.component.html',
  styleUrls: ['recipe-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RecipeListComponent implements OnInit {
  public filteredRecipes: Recipe[];
  public filteredSharedRecipes: Recipe[];
  public ingredients: string[];
  public query: string = 'name';
  public queryIngredients: string[] = [];
  public recipes: Recipe[];
  public sharedRecipes: Recipe[];
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private recipeDataSvc: RecipeDataService,
    public drawerSvc: DrawerService
  ) { }

  ngOnInit(): void {
    this.recipeDataSvc.getMyRecipes().then((data: Recipe[]) => {
      this.recipes = [...data];
      this.filteredRecipes = [...this.recipes.slice(0, 5)];
      this.changeDetectionRef.detectChanges();
    });

    this.recipeDataSvc.getSharedRecipes().then((data: Recipe[]) => {
      this.sharedRecipes = [...data];
      this.filteredSharedRecipes = [...this.recipes];
      this.changeDetectionRef.detectChanges();
    });
  }
}