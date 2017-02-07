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
import { Food } from './food';

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
    return newFood;
  }

  public getFoodReports(foodId: string = ''): Observable<Food[]> {
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

  public getFoods(searhQuery: string = '', start: number = 45, limit: number = 100, foodGroup: string = ''): Observable<Food[]> {
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