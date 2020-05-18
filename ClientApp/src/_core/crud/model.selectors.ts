import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ModelState, getAdapter, getState } from './model.reducers';
import { BaseModel, ModelProto, createModel } from './base.model';
import { AppState } from '../_store/app.reducer';
import { QueryResultsModel } from './query-results.model';
import { each } from 'lodash';
import { sortArray  } from '../_utilities/utility';

const selectState = (state: AppState) => state.modelState;

export const selectInStore =  (item:ModelProto ) =>
   createSelector( selectState,
    stateArr => {

      const state = getState(stateArr,createModel(item));
      const items: BaseModel[] = [];
      each(state.entities, e => { items.push(e) });
      const sorted = sortArray(items, state.lastQuery.sortField, state.lastQuery.sortOrder);
      return new QueryResultsModel(sorted, state.totalCount, '');
    }
  );

export const selectLastCreatedModelId = (item:ModelProto) =>
  createSelector( selectState, stateArr => getState(stateArr, createModel(item)).lastCreatedId);

export const selectPageLoading = (item: ModelProto) =>
  createSelector(selectState, stateArr => getState(stateArr, createModel(item)).listLoading);

export const selectActionLoading = (item: ModelProto) =>
  createSelector(selectState, stateArr => getState(stateArr, createModel(item)).actionsloading);

export const selectInitWaitingMessage = (item: ModelProto) => 
  createSelector( selectState, state => getState(state, createModel(item)).showInitWaitingMessage);

export const selectModelById = (item: ModelProto, itemId: number) =>
  createSelector(selectState, state =>getState(state,createModel(item)).entities[itemId]);

export const selectActionResult = (item: ModelProto) => {
  return createSelector(selectState, state => {
    return getState(state, createModel(item)).error;
  });
}






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


