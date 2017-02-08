// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Lodash
import * as _ from 'lodash';

// THG
import { Food, FoodGroup } from './food';

export const FOOD_GROUPS: Array<FoodGroup> = [
  new FoodGroup('', 'All foods'),
  new FoodGroup('3500', 'American Indian/Alaska Native Foods'),
  new FoodGroup('0300', 'Baby Foods'),
  new FoodGroup('1800', 'Baked Products'),
  new FoodGroup('1300', 'Beef Products'),
  new FoodGroup('1400', 'Beverages'),
  new FoodGroup('0800', 'Breakfast Cereals'),
  new FoodGroup('2000', 'Cereal Grains and Pasta'),
  new FoodGroup('0100', 'Dairy and Egg Products'),
  new FoodGroup('2100', 'Fast Foods'),
  new FoodGroup('0400', 'Fats and Oils'),
  new FoodGroup('1500', 'Finfish and Shellfish Products'),
  new FoodGroup('0900', 'Fruits and Fruit Juices'),
  new FoodGroup('1700', 'Lamb, Veal, and Game Products'),
  new FoodGroup('1600', 'Legumes and Legume Products'),
  new FoodGroup('2200', 'Meals, Entrees, and Side Dishes'),
  new FoodGroup('1200', 'Nut and Seed Products'),
  new FoodGroup('1000', 'Pork Products'),
  new FoodGroup('0500', 'Poultry Products'),
  new FoodGroup('3600', 'Restaurant Foods'),
  new FoodGroup('0700', 'Sausages and Luncheon Meats'),
  new FoodGroup('2500', 'Snacks'),
  new FoodGroup('0600', 'Soups, Sauces, and Gravies'),
  new FoodGroup('0200', 'Spices and Herbs'),
  new FoodGroup('1900', 'Sweets'),
  new FoodGroup('1100', 'Vegetables and Vegetable Products'),
];

@Injectable()
export class FoodService {
  private _usdaApiKey: string = '5nW8It7ORsxY212bV5wpleHkblTLbvpFTKVa010U';
  private _foodListUrl: string = 'https://api.nal.usda.gov/ndb/search';
  private _foodNutritionUrl: string = 'http://api.nal.usda.gov/ndb/reports';
  constructor(private _http: Http) { }

  private _serializeFood(usdaFood: any): Food {
    let newFood: Food = new Food(usdaFood['name'], usdaFood['fg']);
    newFood.nutrition.setWaterValue(usdaFood['nutrients'][0]);
    newFood.nutrition.setEnergyValue(usdaFood['nutrients'][1]);
    newFood.nutrition.setProteinValue(usdaFood['nutrients'][3]);
    newFood.nutrition.setFatsValue(usdaFood['nutrients'][4]);
    newFood.nutrition.setCarbsValue(usdaFood['nutrients'][6]);
    newFood.nutrition.setFiberValue(usdaFood['nutrients'][7]);
    newFood.nutrition.setSugarsValue(usdaFood['nutrients'][8]);
    newFood.nutrition.setCalciumValue(usdaFood['nutrients'][15]);
    newFood.nutrition.setIronValue(usdaFood['nutrients'][16]);
    newFood.nutrition.setMagnesiumValue(usdaFood['nutrients'][17]);
    newFood.nutrition.setPhosphorusValue(usdaFood['nutrients'][18]);
    newFood.nutrition.setPotassiumValue(usdaFood['nutrients'][19]);
    newFood.nutrition.setSodiumValue(usdaFood['nutrients'][20]);
    newFood.nutrition.setZincValue(usdaFood['nutrients'][21]);
    newFood.nutrition.setCopperValue(usdaFood['nutrients'][22]);
    newFood.nutrition.setManganeseValue(usdaFood['nutrients'][23]);
    newFood.nutrition.setSeleniumValue(usdaFood['nutrients'][24]);
    newFood.nutrition.setVitaminCValue(usdaFood['nutrients'][26]);
    newFood.nutrition.setVitaminB1Value(usdaFood['nutrients'][27]);
    newFood.nutrition.setVitaminB2Value(usdaFood['nutrients'][28]);
    newFood.nutrition.setVitaminB3Value(usdaFood['nutrients'][29]);
    newFood.nutrition.setVitaminB5Value(usdaFood['nutrients'][30]);
    newFood.nutrition.setVitaminB6Value(usdaFood['nutrients'][31]);
    newFood.nutrition.setVitaminB9Value(usdaFood['nutrients'][33]);
    newFood.nutrition.setCholineValue(usdaFood['nutrients'][36]);
    newFood.nutrition.setVitaminB12Value(usdaFood['nutrients'][38]);
    newFood.nutrition.setVitaminAValue(usdaFood['nutrients'][40]);
    newFood.nutrition.setVitaminEValue(usdaFood['nutrients'][48]);
    newFood.nutrition.setVitaminDValue(usdaFood['nutrients'][53]);
    newFood.nutrition.setVitaminKValue(usdaFood['nutrients'][56]);
    newFood.nutrition.setSatFatValue(usdaFood['nutrients'][57]);
    newFood.nutrition.setOmega6Value(usdaFood['nutrients'][84]);
    newFood.nutrition.setOmega3Value(usdaFood['nutrients'][85]);
    newFood.nutrition.setTransFatValue(usdaFood['nutrients'][94]);
    newFood.nutrition.setCholesterolValue(usdaFood['nutrients'][96]);
    newFood.nutrition.setTryptophanValue(usdaFood['nutrients'][97]);
    newFood.nutrition.setThreonineValue(usdaFood['nutrients'][98]);
    newFood.nutrition.setIsoleucineValue(usdaFood['nutrients'][99]);
    newFood.nutrition.setLeucineValue(usdaFood['nutrients'][100]);
    newFood.nutrition.setLysineValue(usdaFood['nutrients'][101]);
    newFood.nutrition.setMethionineValue(usdaFood['nutrients'][102]);
    newFood.nutrition.setPhenylalanineValue(usdaFood['nutrients'][104]);
    newFood.nutrition.setValineValue(usdaFood['nutrients'][106]);
    newFood.nutrition.setHistidineValue(usdaFood['nutrients'][108]);
    newFood.nutrition.setAlcoholValue(usdaFood['nutrients'][115]);
    newFood.nutrition.setCaffeineValue(usdaFood['nutrients'][116]);

    return newFood;
  }

  public getFoodReports$(foodId: string = ''): Observable<Food> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('nbno', foodId);
    params.set('type', 'f');
    options.headers = headers;
    options.search = params;

    return this._http.get(this._foodListUrl, options)
      .map((res: Response) => {
        let body = res.json();
        console.log(body);
        if (body.hasOwnProperty('errors')) {
          console.log(body.errors);
          return null;
        }

        return this._serializeFood(body['report']['food']);
      }).catch((err: Error) => {
        console.error(err);
        return Observable.throw(err)
      });
  }

  public getFoods$(searhQuery: string = '', start: number = 45, limit: number = 100, foodGroup: string = ''): Observable<Array<Food>> {
    let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
      options: RequestOptions = new RequestOptions(),
      params: URLSearchParams = new URLSearchParams();

    params.set('api_key', this._usdaApiKey);
    params.set('q', searhQuery);
    params.set('fg', searhQuery);
    params.set('sort', 'n');
    params.set('max', `${limit}`);
    params.set('offset', `${start}`);
    options.headers = headers;
    options.search = params;

    return this._http.get(this._foodListUrl, options)
      .map((res: Response) => {
        let body = res.json();
        console.log(body);
        if (body.hasOwnProperty('errors')) {
          console.log(body.errors);
          return [];
        }
        return body['list']['item'];
      }).catch((err: Error) => {
        console.error(err);
        return Observable.throw(err)
      });
  }
}