import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { BaseModel } from './base.model';
import { QueryParamsModel } from './query-params.model';

export enum ActionTypes {
	AllItemsRequested = 'All Requested',
	AllItemsLoaded = 'All Loaded',
	OnServerCreated = 'On Server Created',
	Created = 'Created',
	Updated = 'Updated',
	StatusUpdated = 'Status Updated',
	OneDeleted = 'One Deleted',
	ManyDeleted = 'Many  Deleted',
	PageRequested = 'Page Requested',
	PageLoaded = 'Page Loaded',
	PageCancelled = 'Page Cancelled',
	PageLoading = 'Page Loading',
	ActionLoading = 'Action Loading'
}

export class AllRequested implements Action {
  constructor(public item: BaseModel) { }
	readonly type = ActionTypes.AllItemsRequested;
}

export class AllLoaded implements Action {
	readonly type = ActionTypes.AllItemsLoaded;
	constructor(public payload: {item: BaseModel, items: BaseModel[] }) { }
}

export const GetServerCreate = <T extends BaseModel>(item:T) => new ServerCreate({ item});
export class ServerCreate implements Action {
	readonly type = ActionTypes.OnServerCreated;
	constructor(public payload: { item: BaseModel }) { }
}

export class Created implements Action {
	readonly type = ActionTypes.Created;
	constructor(public payload: { item: BaseModel , newItem:BaseModel}) { }
}

export class Updated implements Action {
	readonly type = ActionTypes.Updated;
	constructor(public payload: {
		partialItems: Update<BaseModel>, 
		item: BaseModel 
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

export class OneDeleted implements Action {
	readonly type = ActionTypes.OneDeleted;
	constructor(public payload: {item: BaseModel  }) { }
}

export class ManyDeleted implements Action {
	readonly type = ActionTypes.ManyDeleted;
	constructor(public payload: {item: BaseModel, ids: number[] }) { }
}


export class PageRequested  implements Action {
	readonly type = ActionTypes.PageRequested;
	constructor(public payload: {item: BaseModel, page: QueryParamsModel }) { }
}
export const GetPageRequested = <T extends BaseModel>(type: new () => T, page: QueryParamsModel) =>
  new PageRequested({ item: new type(), page });

export class PageLoaded  implements Action {
	readonly type = ActionTypes.PageLoaded;
	constructor(public payload: { item: BaseModel,items: BaseModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class PageCancelled  implements Action {
	readonly type = ActionTypes.PageCancelled;
	constructor(public payload: {item: BaseModel}) { }
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

/*
export const addError = (item: BaseModel, error: string) => new ActionError({item,error});
export const clearError = (item: BaseModel) => new ActionError({ item, error: null });
export class ActionError  implements Action {
	readonly type = ActionTypes.ActionLoading;
	constructor(public payload: { item: BaseModel, error: string }) { }
}
*/

export type ModelActions = ServerCreate
	| Created
	| Updated
  | ServerCreate
	| StatusUpdated
	| OneDeleted
	| ManyDeleted
	| PageRequested
	| PageLoaded
	| PageCancelled
	| PageLoading
	| ActionLoading
	| AllLoaded
	| AllRequested
	;
