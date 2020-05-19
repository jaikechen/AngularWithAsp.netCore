import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { mergeMap, map, tap, withLatestFrom, filter, catchError, delay } from 'rxjs/operators';
import { Effect, Actions, ofType, act } from '@ngrx/effects';
import { Store, Action, select } from '@ngrx/store';
import { defer, Observable, of } from 'rxjs';


import { ModelService } from './model.service';
import { AppState } from '../_store/app.reducer';
import {
  PageRequest, ActionTypes, showPageLoading, PageLoaded, Created, showActionLoading, hideActionLoading,
  CreateRequest, UpdateRequest, Updated, ManyDeleteRequest, ManyDeleted, DeleteRequst, Deleted
} from './model.action';


@Injectable()
export class ModelEffect {
 

  @Effect()
  loadPage$ = this.actions$
    .pipe(
      ofType<PageRequest>(ActionTypes.PageRequest),
      mergeMap(({ payload }) => {
        this.store.dispatch(showPageLoading(payload.type));
        const requestToServer = this.service.find(payload.type, payload.page);
        return requestToServer.pipe(
          map(res => {
            var action = new PageLoaded({
              type: payload.type,
              page: payload.page,
              totalCount: res.totalCount,
              items: res.items
            });
            console.log(action);
            return action;
          })
        );
      }),
    );


  @Effect()
  serverCreate$ = this.actions$
      .pipe(
        ofType<CreateRequest>(ActionTypes.CreateRequest),
        mergeMap(({ payload }) => {
          this.store.dispatch(showActionLoading(payload.type));
        return this.service.create(payload.type,payload.item).pipe(
          map(item => {
            this.store.dispatch(new Created({type:payload.type, item:item}));
            return hideActionLoading(payload.type, null);
          }),
          catchError((err) => { return of(hideActionLoading(payload.type, err.error)); }
          )
        );
      }),
   );

   @Effect()
  delete$ = this.actions$
       .pipe(
         ofType<DeleteRequst>(ActionTypes.DeleteRequst),
         mergeMap(({ payload }) => {
           this.store.dispatch(showActionLoading(payload.type));
           return this.service.delete(payload.type, payload.id).pipe(
             map(() => {
               this.store.dispatch(new Deleted(payload));
               return hideActionLoading(payload.type, null)
             }),
          catchError((err) => { return of(hideActionLoading(payload.type, err.error)); } )
        );
      })
    );

   @Effect()
  update$ = this.actions$
    .pipe(
      ofType<UpdateRequest>(ActionTypes.UpdateRequest),
      mergeMap(({ payload }) => {
        this.store.dispatch(showActionLoading(payload.type));
        return this.service.update(payload.type,payload.item).pipe(
          map(() => {
            this.store.dispatch(new Updated(payload))
            return hideActionLoading(payload.type, null)
          }),
          catchError((err) => { return of(hideActionLoading(payload.type, err.error)); })
        );
      })
    );


   @Effect()
  deleteItems$ = this.actions$
       .pipe(
         ofType<ManyDeleteRequest>(ActionTypes.ManyDeleteRequest),
      mergeMap(({ payload }) => {
        console.log(payload);
        this.store.dispatch(showActionLoading(payload.type));
        return this.service.deleteItems(payload.type,payload.ids).pipe(
          map(() => {
            this.store.dispatch(new ManyDeleted(payload))
            return hideActionLoading(payload.type, null);
          }),
          catchError((err) => { return of(hideActionLoading(payload.type, err.error)); }
          )
        );
      })
    );


  constructor(private actions$: Actions, private service: ModelService, private store: Store<AppState>) { }
}


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
