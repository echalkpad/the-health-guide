import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FileUploadService {
  constructor(private http: Http) {}

  public getBenchmarck(): Observable<any> {
    return this.http.get('assets/docs/FSORT.tra').map((res: Response) => res);
  }

}
