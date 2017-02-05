// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Http, URLSearchParams, Response, RequestOptions, Headers } from '@angular/http';
import { NSHttp } from 'nativescript-angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Lodash
import * as _ from 'lodash';

// THG
import { Food } from './food.model';

@Injectable()
export class FoodService {
    private _usdaApiKey: string = '5nW8It7ORsxY212bV5wpleHkblTLbvpFTKVa010U';
    private _foodSearchUrl: string = 'https://api.nal.usda.gov/ndb/search';
    private _foodReportUrl: string = 'http://api.nal.usda.gov/ndb/reports';
    constructor(private _http: NSHttp) { }

    public getUSDAFoods(searhQuery: string = '', chunckStart: number = 45, chunkLimit: number = 50): Observable<Food[]> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' }),
            options: RequestOptions = new RequestOptions(),
            params: URLSearchParams = new URLSearchParams();
        params.set('lt', 'f');
        params.set('q', searhQuery);
        params.set('sort', 'n');
        params.set('api_key', this._usdaApiKey);
        params.set('offset', `${chunckStart}`);
        params.set('max', `${chunkLimit}`);
        options.headers = headers;
        options.search = params;

        return this._http.get(this._foodSearchUrl, options)
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