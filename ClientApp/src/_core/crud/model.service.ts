import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseModel  } from './base.model';
import { HttpUtilsService } from './http-utils.service';
import { QueryParamsModel } from './query-params.model';
import { QueryResultsModel } from './query-results.model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }
 
  getUrl(type: string) {
    return `api/${type}`;
  }

	create(type:string , item: BaseModel  ):Observable< BaseModel> {
		var httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<BaseModel>(this.getUrl(type), item, { headers: httpHeaders});
	}
/*
	getAll<T>(item:T,sortField:string): Observable<QueryResultsModel> {
		let queryParam: QueryParamsModel = new QueryParamsModel({});
		queryParam.pageSize = 0;
		queryParam.sortField = sortField;
    const result = this.find(item, queryParam);
    return result;
	}
  */

  getById(type: string, id: number) {
		return this.http.get( this.getUrl(type) + `/${id}`);
	}

  find(type: string, queryParams: QueryParamsModel) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = this.getUrl(type);
		const result = this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params:  httpParams
		});
    return result;
	}

	update(type:string,item: BaseModel){
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put( this.getUrl(type) + "/" + item.id, item, { headers: httpHeader });
	}

  /*
	updateStatus<T>(item:T, ids: number[], status: string): Observable<T> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { status, ids };
		const url = this.getURL(item) ;
		return this.http.put<T>(url, body, { headers: httpHeaders });
	}
  */

	delete(type:string, id:number)  {
		const url = `${this.getUrl(type)}/${id}`;
		return this.http.delete(url);
	}

  deleteItems(type: string, ids: number[] = []): Observable<QueryResultsModel> {
		const url = this.getUrl(type) ;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {status:'delete', ids };
		const result = this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders} );
    return result;
	}
}
