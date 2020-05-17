// Angular
import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { QueryParamsModel } from './query-params.model';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  getFindHTTPParams(queryParams: QueryParamsModel): HttpParams {
    var params = new HttpParams()
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('pageNumber', queryParams.pageNumber.toString())
      .set('pageSize', queryParams.pageSize.toString());

    for (var i = 0; i < queryParams.filter.length; i++) {
      params = params.set(queryParams.filter[i].name, queryParams.filter[i].value);
    }
    return params;
  }

  getHTTPHeaders(): HttpHeaders {
    var result = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return result;
  }
}

