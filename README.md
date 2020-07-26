# AngularWithAsp.netCore
This project was built on Viusal studio 2019 Angular Spa whith Asp.net core web api tmeplate.
I made the ngRx state management functions generic, so when adding new CRUD pages, I can reuse the state managment code. 
## Purpose 
Recently, I had some projects with smiliar requirments,  Like 
- Authentication and autorization
- User Management, 
- Material UI look,
- CRUD entities,
- ngRx to manage state

So I think it makes sense to build my own start up project template, so I don't need copy code everytime, 

## Why ngRx
### triditional asp.net mvc page
Before usring SPA, I use asp.net core mvc page to implement UI. No state is stored in browser, so bacically every operation in the browser will cause page sumbmitting and reloading.
for example, I have the following pages
- user-list.aspx
- user-edit.aspx
Every time a user entity is edited, the entire user-list.aspx page needs to refresh to apply the changes. that is a bad use expirence.

### with spa and State
while using SPA router and ajax, the page dosn't reload, the page only retrieves the partial data it needs(usually json). So it possible to save state in broswer.
- user-list page, the browser caches all user entities
- user-edit page, it get user directly from cache, then it submit changes to backend; if database operations are succeed, it update the cache.

### ngRx
if the cache is a normal gobal array in javascript, the user-edit page needs to inform user-list page. that will make managing state in browser complex. With Angular ngRx, all page subscribes to the store are re-rendered if the state is changed.
## code struture 

- clinetApp/src/
- -------------_core/crud/
- -----------------------model.action.ts
- -----------------------model.datasource.ts
- -----------------------model.effect.ts
- -----------------------model.reducer.ts
- -----------------------model.selector.ts
- -----------------------model.service.ts
- ------------app/[model]/
- ------------------------[model]-list.ts
- ------------------------[model]-edit.ts

- controlers
- ----------[model]Controller.cs

## workflow of load entity list
take the user entity as example
1. on user-list page, 
1.1 initialize model.datasource, when model.datasource is constructing, it subscribe to the selector 'selectInStore', if it get payload, it emit the payload to entitySubject
```
  this.store.pipe(
      select(selectInStore(this.type)),
		).subscribe((response: QueryResultsModel) => {
                ...
                this.entitySubject.next(response.items);
		});
```
1.2 user-list page subscripts to the entitySubject, so whenever user-list get payload, it re-render the page 
```
	const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.result = res;
		});
```
1.3 dispatch the action 
```
    this.store.dispatch(getPageRequested(USER_TYPE, queryParams));
```

2. model.effect.ts gets the action, invokes model.service
```
   const requestToServer = this.service.find(payload.type, payload.page);
```
2.1 when model.service.ts gets invoked, it uses http to call the web api
```
	const result = this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params:  httpParams
		});
```
2.2 in webapi, userController.cs, user entityFramework to get user list
```
            var items = _context.ApplicationUser 
                .Where(x => string.IsNullOrWhiteSpace(name) 
                || x.FirstName.Contains(name)
                || x.LastName.Contains(name)
                );

            var result =  items.ToPaged(pageNumber, pageSize,sortField, sortOrder);
```
2.3 the model.effect dispatch another action PageLoaded
3. in model.reducer, get the pageLoaded action, then it update the state, put the result to state
4. thanks to Rxjs, user-list page get notified, then it re-render the page.

## make ngRx generic- taking creating entity as example.
### model.service.ts
the Angular http.post is generic. so make create function generaic is easy,  the create function receives an stirng type(entity type) as a parameter, then composes the url to call the corrospond web api controller.
```
	create(type:string , item: BaseModel  ):Observable< BaseModel> {
		var httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<BaseModel>(this.getUrl(type), item, { headers: httpHeaders});
	}
```
```
  getUrl(type: string) {
    return `api/${type}`;
  }
```

### model.effect.ts
in model.action, I already put type to the payload
```
export class CreateRequest implements Action {
  readonly type = ActionTypes.CreateRequest;
  constructor(public payload: {
    type:string,
    item: BaseModel
  }) { }
}
```
so in model.effect.ts, I just need call model.service.create
```
 return this.service.create(payload.type,payload.item).pipe(
          map(item => {
            this.store.dispatch(new Created({type:payload.type, item:item}));
            return hideActionLoading(payload.type, null);
          }),
          catchError((err) => { return of(hideActionLoading(payload.type, err.error)); }
          )
        );
```
### model.reducer.ts
incase several entities involves in a page, the initial state of modelReducer is  an array, 
```
export function modelReducer(stateArr = <ModelState[]>[], action: ModelActions): ModelState[] {

```
each item in arr holds the state of an entity
```
export interface ModelState extends EntityState<BaseModel> {
  entityType: string;
  listLoading: boolean;
  totalCount: number;
  ...
```
so in reducer, when it gets Created message, it 
1. find the entity state from the state Array,
2. then update the entity state, 
3. push the state back to the array.
```
export function getState(stateArray: ModelState[], type: string): ModelState {
  let find = stateArray.find(x => x.entityType == type);
  if (find == null) {
    find = getInitialState(type);
  }
  return find;
}
```
```
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
```
in the pushState function, it must create an new array, to let ngRx know the array is changed.
```
function pushState(arr: ModelState[], state: ModelState): ModelState[] {
  return [...arr.filter(x => x.entityType != state.entityType), state];
}
```

## Todo:
for each entity CRUD, I have to crate a [model]-list and a [model]-edit, which also causes code redundency
for each entity, I have to create a web api controller for it, which also causes code redundency

I created a react with node.js demo. which also makes headend and pages generic, check the following code repo. 
https://github.com/jaikechen/react-nest-fullstack-generic-demo

