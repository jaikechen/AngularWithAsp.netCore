import { ActionReducerMap } from '@ngrx/store';
import { ModelState, modelReducer } from '../crud/model.reducers';


export interface AppState {
  modelState:  ModelState[]
}

export const appReducer: ActionReducerMap<AppState> = {
  modelState: modelReducer
};
