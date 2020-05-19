import {  createSelector } from '@ngrx/store';
import { getState } from './model.reducers';
import { BaseModel } from './base.model';
import { AppState } from '../_store/app.reducer';
import { QueryResultsModel } from './query-results.model';
import { each } from 'lodash';
import { sortArray  } from '../_utilities/utility';

const selectState = (state: AppState) => state.modelState;

export const selectInStore =  (type:string ) =>
   createSelector( selectState,
    stateArr => {

      const state = getState(stateArr,type);
      const items: BaseModel[] = [];
      each(state.entities, e => { items.push(e) });
      const sorted = sortArray(items, state.lastQuery.sortField, state.lastQuery.sortOrder);
      return new QueryResultsModel(sorted, state.totalCount, '');
    }
  );

export const selectLastCreatedModelId = (type:string) =>
  createSelector( selectState, stateArr => getState(stateArr, type).lastCreatedId);

export const selectPageLoading = (type: string) =>
  createSelector(selectState, stateArr => getState(stateArr, type).listLoading);

export const selectActionLoading = (type:string) =>
  createSelector(selectState, stateArr => getState(stateArr, type).actionsloading);

export const selectInitWaitingMessage = (type:string) => 
  createSelector( selectState, state => getState(state, type).showInitWaitingMessage);

export const selectModelById = (type:string, itemId: number) =>
  createSelector(selectState, state =>getState(state,type).entities[itemId]);

export const selectActionResult = (type: string) => {
  return createSelector(selectState, state => {
    return getState(state, type).error;
  });
}






/*
class TypeSelector {
  entityType: string;
  selector: MemoizedSelector<object, ModelState>;
}

const selectorArr: TypeSelector[] = [];

export function getFeaturSelectorByType(entityType: string): MemoizedSelector<object, ModelState> {
  let find = selectorArr.find(x => x.entityType == entityType);
  if (find == null) {
    find = {
      entityType,
      selector: createFeatureSelector<ModelState>(entityType)
    };
    selectorArr.push(find);
  }
  return find.selector;
}

export function selectAll<T extends BaseModel>(entity: string) {
  const adapter = getAdapter(entity);
  const feature = getFeaturSelectorByType(entity);
  return createSelector(
    feature,
    adapter.getSelectors().selectAll
  )
};

export function allLoaded<T extends BaseModel>(item: T) {
  const entityType = item.constructor.name;
  const feature = getFeaturSelectorByType(entityType);
  return createSelector(
    feature,
    s => s.isAllItemsLoaded
  );
}

*/

