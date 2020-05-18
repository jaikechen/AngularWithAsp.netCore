import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { mergeMap, map, tap, withLatestFrom, filter, catchError, delay } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action, select } from '@ngrx/store';
import { defer, Observable, of } from 'rxjs';


import { ModelService } from './model.service';
import { QueryResultsModel } from './query-results.model';
import { QueryParamsModel } from './query-params.model';
import { AppState } from '../_store/app.reducer';
import { PageRequest, ActionTypes, showPageLoading, PageLoaded, Created, showActionLoading, hideActionLoading, Deleted, ManyDeleted, ManyDeleteRequest } from './model.action';


@Injectable()
export class ModelEffect {
  /*
	@Effect()
	loadAll$ = this.actions$
      .pipe(
        ofType(ActionTypes.AllItemsRequested),
        withLatestFrom(this.store.pipe(select(allLoaded))),
			filter(([action, isAllItemsLoaded]) => {
			
				return !isAllItemsLoaded;
			}),
			mergeMap(() => this.service.getAll()),
        map(x => {
          
          return new AllLoaded({ entity: x. });
			})
        );
   */

  @Effect()
  loadPage$ = this.actions$
    .pipe(
      ofType<PageRequest>(ActionTypes.PageRequest),
      mergeMap(({ payload }) => {
        this.store.dispatch(showPageLoading(payload.item));
        const requestToServer = this.service.find(payload.item, payload.page);
        const lastQuery = of(payload.page);
        return forkJoin(requestToServer, lastQuery);
      }),
      map(response => {
        const result: QueryResultsModel = response[0];
        const lastQuery: QueryParamsModel = response[1];
        console.log(result);
        return new PageLoaded({
          item: result.item,
          items: result.items,
          totalCount: result.totalCount,
          page: lastQuery
        });
      }),
    );


  @Effect()
  serverCreate$ = this.actions$
      .pipe(
        ofType<Created>(ActionTypes.Created),
        mergeMap(({ payload }) => {
          this.store.dispatch(showActionLoading(payload.item));
        return this.service.create(payload.item).pipe(
          map(item => {
            this.store.dispatch(new Created({ item: payload.item, newItem: item }));
            return hideActionLoading(payload.item, null);
          }),
          catchError((err) => { return of(hideActionLoading(payload.item, err.error)); }
          )
        );
      }),
   );

   @Effect()
  delete$ = this.actions$
       .pipe(
         ofType<Deleted>(ActionTypes.DeleteRequst),
      mergeMap(({ payload }) => {
        this.store.dispatch(showActionLoading(payload.item));
        return this.service.delete(payload.item).pipe(
          map(() => hideActionLoading(payload.item, null)),
          catchError((err) => { return of(hideActionLoading(payload.item, err.error)); }
          )
        );
      })
    );

   @Effect()
  deleteItems$ = this.actions$
       .pipe(
         ofType<ManyDeleteRequest>(ActionTypes.ManyDeleteRequest),
      mergeMap(({ payload }) => {
        console.log(payload);
        this.store.dispatch(showActionLoading(payload.item));
        return this.service.deleteItems(payload.item,payload.ids).pipe(
          map(() => {
            this.store.dispatch(new ManyDeleted(payload))
            return hideActionLoading(payload.item, null);
          }),
          catchError((err) => { return of(hideActionLoading(payload.item, err.error)); }
          )
        );
      }
      )
    );

  /*
 



 

  @Effect()
  updateProductsStatus$ = this.actions$
    .pipe(
      ofType<GuideStatusUpdated>(ActionTypes.StatusUpdated),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        console.log(payload)
        return this.service.updateStatus(payload.ids, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  update$ = this.actions$
    .pipe(
      ofType<GuideUpdated>(ActionTypes.Updated),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.service.update(payload.item);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

 
    */

  constructor(private actions$: Actions, private service: ModelService, private store: Store<AppState>) { }
}
