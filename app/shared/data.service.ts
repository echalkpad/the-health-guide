import { Injectable } from '@angular/core';
import * as appSettings from "application-settings";

import { Auth, User } from '../auth';
import { Food } from '../food';
import { Nutrient } from '../nutrients';
import { Recipe } from '../recipes';

@Injectable()
export class DataService {

  constructor() { }

  public getAuth(): Auth {
    if (!appSettings.getString('auth')) {
      return null;
    }
    return JSON.parse(appSettings.getString('auth'));
  }

  public removeAuth(): void {
    appSettings.remove('auth');
  }

  public saveAuth(auth: Auth): void {
    appSettings.setString('auth', JSON.stringify(auth));
  }

  public getFood(): Food {
    if (!appSettings.getString('food')) {
      return null;
    }
    return JSON.parse(appSettings.getString('food'));
  }

  public removeFood(): void {
    appSettings.remove('food');
  }

  public saveFood(food: Food): void {
    appSettings.setString('food', JSON.stringify(food));
  }

  public getNutrient(): Nutrient {
    if (!appSettings.getString('nutrient')) {
      return null;
    }
    return JSON.parse(appSettings.getString('nutrient'));
  }

  public removeNutrient(): void {
    appSettings.remove('nutrient');
  }

  public saveNutrient(nutrient: Nutrient): void {
    appSettings.setString('nutrient', JSON.stringify(nutrient));
  }

  public getRecipe(): Recipe {
    if (!appSettings.getString('recipe')) {
      return null;
    }
    return JSON.parse(appSettings.getString('recipe'));
  }

  public removeRecipe(): void {
    appSettings.remove('recipe');
  }

  public saveRecipe(recipe: Recipe): void {
    appSettings.setString('recipe', JSON.stringify(recipe));
  }

  public getUser(): User {
    if (!appSettings.getString('user')) {
      return null;
    }
    return JSON.parse(appSettings.getString('user'));
  }

  public removeUser(): void {
    appSettings.remove('user');
  }

  public saveUser(user: User): void {
    appSettings.setString('user', JSON.stringify(user));
  }

}
