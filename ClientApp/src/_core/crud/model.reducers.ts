import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
import { BaseModel, ModelName, getModelName } from './base.model';
import { QueryParamsModel } from './query-params.model';
import { ModelActions, ActionTypes } from './model.action';

const adapterFactory = {}
export function getAdapter(item: ModelName): EntityAdapter<BaseModel> {
  const entityType = getModelName(item)
  if (adapterFactory[entityType] == null) {
    adapterFactory[entityType] = createEntityAdapter<BaseModel>()
  }
  return adapterFactory[entityType]
}

export interface ModelState extends EntityState<BaseModel> {
  entityType: string;
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
  isAllItemsLoaded: boolean;
  error: string;
}

function getInitialState(item: ModelName): ModelState {

  const entityType = getModelName(item)
  const adapter = getAdapter(entityType);
  const find = adapter.getInitialState({
    entityType,
    isAllItemsLoaded: false,
    itemForEdit: null,
    listLoading: false,
    actionsloading: false,
    totalCount: 0,
    lastCreatedId: undefined,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    error: ''
  });
  return find;
}

export function getState(stateArray: ModelState[], item: ModelName): ModelState {
  const entityType = getModelName(item)
  let find = stateArray.find(x => x.entityType == entityType);
  if (find == null) {
    find = getInitialState(entityType);
  }
  return find;
}

function pushState(arr: ModelState[], state: ModelState): ModelState[] {
  return [...arr.filter(x => x.entityType != state.entityType), state];
}

export function modelReducer(stateArr = <ModelState[]>[], action: ModelActions): ModelState[] {
  switch (action.type) {
    case ActionTypes.PageLoaded: {
      const adapter = getAdapter(action.payload.item);
      const state = adapter.addMany(action.payload.items, {
        ...getInitialState(action.payload.item),
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
      return pushState(stateArr, state);
    }

    /*
  case ActionTypes.: {
    const adapter = getAdapter(action.payload.item);
    let state = getState(stateArr, action.payload.item);
    state = adapter.addAll(
      action.payload.items,
      {
        ...state, isAllItemsLoaded: true
      }
    );
    return pushState(stateArr, state);
  }
  */


    case ActionTypes.PageLoading: {
      let state = getState(stateArr, action.payload.item);
      state = {
        ...state, listLoading: action.payload.isLoading, lastCreatedId: undefined
      };
      return pushState(stateArr, state);
    }

    case ActionTypes.ActionLoading: {
      let state = getState(stateArr, action.payload.item);
      state = { ...state, actionsloading: action.payload.isLoading, error: action.payload.error }
      return pushState(stateArr, state);
    }
    case ActionTypes.Created:
      {
        const adapter = getAdapter(action.payload.item);
        let state = getState(stateArr, action.payload.item);
        state = adapter.addOne(action.payload.newItem, {
          ...state,
          lastCreatedId: action.payload.newItem.id
        });
        return pushState(stateArr, state);
      }
    case ActionTypes.Deleted:
      {
        const adapter = getAdapter(action.payload.item);
        let state = getState(stateArr, action.payload.item);
        state = adapter.removeOne(action.payload.item.id.toString(), state);
        return pushState(stateArr, state);
      }
        case ActionTypes.ManyDeleted:
    {
        const adapter = getAdapter(action.payload.item);
        let state = getState(stateArr, action.payload.item);
        state = adapter.removeMany(action.payload.ids, state);
        return pushState(stateArr, state);
    }

    /*
 
  case ActionTypes.OnServerCreated:
    {
      const entityType = action.payload.item.constructor.name;
      let typeState = getStateByType(state, entityType);
      typeState = { ...typeState };
      return state;
    }
  

  case ActionTypes.Updated:
    {
      const entityType = action.payload.item.constructor.name;
      const adapter = getAdapterByType(entityType);
      let typeState = getStateByType(state, entityType);

      typeState = adapter.updateOne(action.payload.partialItems, typeState);
      return state;
    }
  case ActionTypes.StatusUpdated: {
    const entityType = action.payload.item.constructor.name;
    const adapter = getAdapterByType(entityType);
    let typeState = getStateByType(state, entityType);
    const _partialItems: Update<BaseModel>[] = [];
    for (let i = 0; i < action.payload.ids.length; i++) {
      _partialItems.push({
        id: action.payload.ids[i],
        changes: {
          status: action.payload.status
        }
      });
    }
    typeState = adapter.updateMany(_partialItems, typeState);
    return state;
  }
  case ActionTypes.OneDeleted:
    {

      const entityType = action.payload.item.constructor.name;
      const adapter = getAdapterByType(entityType);
      let typeState = getStateByType(state, entityType);
      typeState = adapter.removeOne(action.payload.item.id.toString(), typeState);

      return [...state.filter(x => x.entityType != entityType), typeState];
    }
  case ActionTypes.ManyDeleted:
    {
      const entityType = action.payload.item.constructor.name;
      const adapter = getAdapterByType(entityType);
      let typeState = getStateByType(state, entityType);
      typeState = adapter.removeMany(action.payload.ids, typeState);
      return state;
    }
  case ActionTypes.PageCancelled: {
    const entityType = action.payload.item.constructor.name;
    let typeState = getStateByType(state, entityType);
    typeState = {
      ...typeState, listLoading: false, lastQuery: new QueryParamsModel({})
    };
    return state;
  }*/
    default: return stateArr;
  }
}
