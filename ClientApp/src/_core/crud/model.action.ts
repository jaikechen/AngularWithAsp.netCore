import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { BaseModel } from './base.model';
import { QueryParamsModel } from './query-params.model';

export enum ActionTypes {
	CreateRequest = 'On Server Created',
  Created = 'On Created',

  UpdateRequest = "On Update Request",
	Updated = 'On Updated',

	StatusUpdateRequest = 'On Many Status Update Request',
	StatusUpdated = 'On Many Status Updated',

  ManyDeleteRequest='On Many Delete Request',
  ManyDeleted='On Many Deleted',

	DeleteRequst = 'On Delete Request',
	Deleted = 'On Deleted',

	PageRequest = 'Page Requested',
	PageLoaded = 'Page Loaded',

	PageLoading = 'Page Loading',
	ActionLoading = 'Action Loading'
}

export class Deleted implements Action {
	readonly type = ActionTypes.Deleted;
	constructor(public payload: {type: string,id:number}) { }
}

export const getDeleteRequest = (type: string, id: number) => new DeleteRequst({ type, id })
export class DeleteRequst implements Action {
	readonly type = ActionTypes.DeleteRequst;
	constructor(public payload: {type:string, id:number   }) { }
}

export class ManyDeleted implements Action {
	readonly type = ActionTypes.ManyDeleted;
	constructor(public payload: {type: string, ids: number[] }) { }
}

export const getManyDeleteRequest =
  (type:string, ids: number[]) => new ManyDeleteRequest({
  type,
  ids
});

export class ManyDeleteRequest implements Action {
	readonly type = ActionTypes.ManyDeleteRequest;
	constructor(public payload: {type: string, ids: number[] }) { }
}

/*
export class StatusUpdateRequest implements Action {
	readonly type = ActionTypes.StatusUpdateRequest;
	constructor(public payload: {
    item: BaseModel,
		ids: number[],
		status:string 
	}) { }
}

export class StatusUpdated implements Action {
  readonly type = ActionTypes.StatusUpdated;
	constructor(public payload: {
    item: BaseModel,
		ids: number[],
		status:string 
	}) { }
}
*/


export const getCreateRequest = (type:string, item: BaseModel) => new CreateRequest({type, item });
export class CreateRequest implements Action {
  readonly type = ActionTypes.CreateRequest;
  constructor(public payload: {
    type:string,
    item: BaseModel
  }) { }
}
export class Created implements Action {
	readonly type = ActionTypes.Created;
	constructor(public payload: { item: BaseModel , type:string}) { }
}


export const getUpdateRequest = (type:string,item:BaseModel,  partialItems: Update<BaseModel>) => new UpdateRequest(
  {
    type,
    item,
    partialItems
  });

export class UpdateRequest implements Action {
  readonly type = ActionTypes.UpdateRequest;
	constructor(public payload: {
    type:string,
		item: BaseModel ,
		partialItems: Update<BaseModel>, 
	}) { }
}

export class Updated implements Action {
	readonly type = ActionTypes.Updated;
	constructor(public payload: {
    type:string,
		item: BaseModel,
		partialItems: Update<BaseModel>, 
	}) { }
}

export class PageRequest  implements Action {
	readonly type = ActionTypes.PageRequest;
	constructor(public payload: {type: string, page: QueryParamsModel }) { }
}
export const getPageRequested = (type: string, page: QueryParamsModel) => new PageRequest({ type, page });

export class PageLoaded  implements Action {
	readonly type = ActionTypes.PageLoaded;
	constructor(public payload: { type: string,items: BaseModel[], totalCount: number, page: QueryParamsModel }) { }
}

export const showPageLoading = (type: string) => new PageLoading({ type, isLoading: true });
export class PageLoading  implements Action {
	readonly type = ActionTypes.PageLoading;
	constructor(public payload: {type: string, isLoading: boolean }) { }
}

export const ACTION_SUCCESS = "Action Sucess";

export const showActionLoading = (type: string) => new ActionLoading({ type, isLoading: true, error:null });
export const hideActionLoading = (type: string, error: string) => new ActionLoading({
  type, isLoading: false,
  error:error == null ? ACTION_SUCCESS: error });

export class ActionLoading  implements Action {
	readonly type = ActionTypes.ActionLoading;
  constructor(public payload: {
    type: string,
    isLoading: boolean,
    error: string
  }) { }
}


export type ModelActions = CreateRequest
  | Created
  | UpdateRequest
  | Updated
  /*
  | StatusUpdateRequest
  | StatusUpdated
  */
  | DeleteRequst
  | Deleted
  | ManyDeleteRequest
  | ManyDeleted
  | PageRequest
  | PageLoaded
	| PageLoading
	| ActionLoading
	;
