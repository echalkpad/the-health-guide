import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';

import { Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public recipes: FirebaseListObservable<Recipe[]>;
  constructor(private recipeSvc: RecipeService) { }

  ngOnInit(): void {
    this.recipes = this.recipeSvc.getMyRecipes();
  }

}
