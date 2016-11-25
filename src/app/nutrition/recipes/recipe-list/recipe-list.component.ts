import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AngularFire, FirebaseListObservable } from "angularfire2";
import { TdDialogService, TdLoadingService } from '@covalent/core';

import { Recipe } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  public avatarUrl: string;
  public chefName: string;
  public recipeImg: string;
  public recipes: Recipe[];
  constructor(
    private af: AngularFire,
    private dialogService: TdDialogService,
    private loadingSvc: TdLoadingService,
    private recipeSvc: RecipeService,
    private router: Router,
    private titleSvc: Title
  ) { }

  private showAlert(): void {
    this.dialogService.openAlert({
      message: 'Sorry, there is no data available at the moment! Please try again later!',
      disableClose: false,
      title: 'No data found',
      closeButton: 'Close'
    }).afterClosed().subscribe(() => this.router.navigate(['/nutrition']));
  }

  ngAfterViewInit(): void {
    this.loadingSvc.register('recipes.load');
    setTimeout(() => {
      this.loadingSvc.resolve('recipes.load');
      if (!this.recipes.length) {
        this.showAlert();
      }
    }, 3000);
    this.titleSvc.setTitle("Food list");
  }

  ngOnInit(): void {
    this.recipeSvc.getMyRecipes().subscribe((data: Recipe[]) => {
      if (!!data && !!data.length) {
        this.recipes = [...data];
      }
    });
    this.recipeSvc.downloadImg('recipe').then((url: string) => this.recipeImg = url);
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.chefName = auth.auth.providerData[0].displayName;
        this.avatarUrl = auth.auth.providerData[0].photoURL;
      }
    });
  }

}
