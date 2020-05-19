import { EntityState, EntityAdapter, createEntityAdapter,  } from '@ngrx/entity';
import { BaseModel} from './base.model';
import { QueryParamsModel } from './query-params.model';
import { ModelActions, ActionTypes } from './model.action';

const adapterFactory = {}
export function getAdapter(type: string): EntityAdapter<BaseModel> {
  if (adapterFactory[type] == null) {
    adapterFactory[type] = createEntityAdapter<BaseModel>()
  }
  return adapterFactory[type]
}

export interface ModelState extends EntityState<BaseModel> {
  entityType: string;
  listLoading: boolean;
  totalCount: number;
  lastCreatedId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
  isAllItemsLoaded: boolean;

  actionsloading: boolean;
  actionsdone: boolean;
  error: string;
}

function getInitialState(type:string): ModelState {

  const adapter = getAdapter(type);
  const find = adapter.getInitialState({
    entityType:type,
    isAllItemsLoaded: false,
    itemForEdit: null,
    listLoading: false,
    totalCount: 0,
    lastCreatedId: undefined,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    actionsloading: false,
    actionsdone: false,
    error: ''
  });
  return find;
}

export function getState(stateArray: ModelState[], type: string): ModelState {
  let find = stateArray.find(x => x.entityType == type);
  if (find == null) {
    find = getInitialState(type);
  }
  return find;
}

function pushState(arr: ModelState[], state: ModelState): ModelState[] {
  return [...arr.filter(x => x.entityType != state.entityType), state];
}

export function modelReducer(stateArr = <ModelState[]>[], action: ModelActions): ModelState[] {
  switch (action.type) {

    case ActionTypes.PageLoaded: {
      console.log(action.payload);
      const adapter = getAdapter(action.payload.type);
      const state = adapter.addMany(action.payload.items, {
        ...getInitialState(action.payload.type),
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
      return pushState(stateArr, state);
    }



    case ActionTypes.PageLoading: {
      let state = getState(stateArr, action.payload.type);
      state = {
        ...state, listLoading: action.payload.isLoading, lastCreatedId: undefined
      };
      return pushState(stateArr, state);
    }

    case ActionTypes.ActionLoading: {
      let state = getState(stateArr, action.payload.type);

      state = { ...state, actionsloading: action.payload.isLoading, error: action.payload.error }
      return pushState(stateArr, state);
    }
    case ActionTypes.Created:
      {
        const adapter = getAdapter(action.payload.type);
        let state = getState(stateArr, action.payload.type);
        state = adapter.addOne(action.payload.item, {
          ...state,
          lastCreatedId: action.payload.item.id
        });
        return pushState(stateArr, state);
      }
    case ActionTypes.Deleted:
      {
        const adapter = getAdapter(action.payload.type);
        let state = getState(stateArr, action.payload.type);
        state = adapter.removeOne(action.payload.id, state);
        return pushState(stateArr, state);
      }

    case ActionTypes.ManyDeleted:
      {
        const adapter = getAdapter(action.payload.type);
        let state = getState(stateArr, action.payload.type);
        state = adapter.removeMany(action.payload.ids, state);
        return pushState(stateArr, state);
      }

    case ActionTypes.Updated:
      {
        const adapter = getAdapter(action.payload.type);
        let state = getState(stateArr, action.payload.type);
        state = adapter.updateOne(action.payload.partialItems, state);
        return pushState(stateArr, state);
      }
    default: return stateArr;
  }
}


    /*
 
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
   */


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
