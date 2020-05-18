import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { BaseModel, createModel, TypeProto } from './base.model';
import { HttpUtilsService } from './http-utils.service';
import { QueryParamsModel } from './query-params.model';
import { QueryResultsModel } from './query-results.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }
  getURL<T extends Object>(item: T) {
    return `api/${item.constructor.name}`;
  }

	create<T>(item: T  ): Observable<T> {
		var httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<T>(this.getURL(item), item, { headers: httpHeaders});
	}

	getAll<T>(item:T,sortField:string): Observable<QueryResultsModel> {
		let queryParam: QueryParamsModel = new QueryParamsModel({});
		queryParam.pageSize = 0;
		queryParam.sortField = sortField;
    const result = this.find(item, queryParam);
    return result;
	}

  getById<T>(item: TypeProto<T>, id: number) {
		return this.http.get<T>( this.getURL(createModel(item)) + `/${id}`);
	}

  find<T>(item: T, queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = this.getURL(item);
		const result = this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params:  httpParams
		});
    return result.pipe( tap(x => x.item = item ));
	}

	update<T extends BaseModel>(item: T): Observable<T> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put<T>( this.getURL(item) + "/" + item.id, item, { headers: httpHeader });
	}

	updateStatus<T>(item:T, ids: number[], status: string): Observable<T> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { status, ids };
		const url = this.getURL(item) ;
		return this.http.put<T>(url, body, { headers: httpHeaders });
	}

	delete<T extends BaseModel>(item:T, id:number): Observable<T> {
		const url = `${this.getURL(item)}/${id}`;
		return this.http.delete<T>(url);
	}

  deleteItems<T>(item: T, ids: number[] = []): Observable<QueryResultsModel> {
		const url = this.getURL(item) ;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {status:'delete', ids };
		const result = this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
    return result;
	}
}
