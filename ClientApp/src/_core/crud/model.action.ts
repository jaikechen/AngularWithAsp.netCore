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
	constructor(public payload: {item: BaseModel  }) { }
}

export class DeleteRequst implements Action {
	readonly type = ActionTypes.DeleteRequst;
	constructor(public payload: {item: BaseModel  }) { }
}

export class ManyDeleted implements Action {
	readonly type = ActionTypes.ManyDeleted;
	constructor(public payload: {item: BaseModel, ids: number[] }) { }
}

export const getManyDeleteRequest =
  <T extends BaseModel>(type: new () => T, ids: number[]) => new ManyDeleteRequest({
  item: new type(),
  ids
});

export class ManyDeleteRequest implements Action {
	readonly type = ActionTypes.ManyDeleteRequest;
	constructor(public payload: {item: BaseModel, ids: number[] }) { }
}

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


export const getCreateRequest = <T extends BaseModel>(item: T) => new CreateRequest({ item });
export class CreateRequest implements Action {
  readonly type = ActionTypes.CreateRequest;
	constructor(public payload: { item: BaseModel }) { }
}
export class Created implements Action {
	readonly type = ActionTypes.Created;
	constructor(public payload: { item: BaseModel , newItem:BaseModel}) { }
}


export const getUpdateRequest = <T extends BaseModel>(item: T) => new CreateRequest({ item });
export class UpdateRequest implements Action {
  readonly type = ActionTypes.UpdateRequest;
	constructor(public payload: {
		partialItems: Update<BaseModel>, 
		item: BaseModel 
	}) { }
}

export class Updated implements Action {
	readonly type = ActionTypes.Updated;
	constructor(public payload: {
		partialItems: Update<BaseModel>, 
		item: BaseModel 
	}) { }
}

export class PageRequest  implements Action {
	readonly type = ActionTypes.PageRequest;
	constructor(public payload: {item: BaseModel, page: QueryParamsModel }) { }
}
export const GetPageRequested = <T extends BaseModel>(type: new () => T, page: QueryParamsModel) =>
  new PageRequest({ item: new type(), page });

export class PageLoaded  implements Action {
	readonly type = ActionTypes.PageLoaded;
	constructor(public payload: { item: BaseModel,items: BaseModel[], totalCount: number, page: QueryParamsModel }) { }
}

export const showPageLoading = (item: BaseModel) => new PageLoading({ item, isLoading: true });
export class PageLoading  implements Action {
	readonly type = ActionTypes.PageLoading;
	constructor(public payload: {item: BaseModel, isLoading: boolean }) { }
}


export const showActionLoading = (item: BaseModel) => new ActionLoading({ item, isLoading: true, error:null });
export const hideActionLoading = (item: BaseModel, error:string) => new ActionLoading({ item, isLoading: false,error });
export class ActionLoading  implements Action {
	readonly type = ActionTypes.ActionLoading;
	constructor(public payload: { item: BaseModel, isLoading: boolean, error:string}) { }
}


export type ModelActions = CreateRequest
  | Created
  | UpdateRequest
  | Updated
  | StatusUpdateRequest
  | StatusUpdated
  | DeleteRequst
  | Deleted
  | ManyDeleteRequest
  | ManyDeleted
  | PageRequest
  | PageLoaded
	| PageLoading
	| ActionLoading
	;
