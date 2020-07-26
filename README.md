# AngularWithAsp.netCore
This project was built on Viusal studio 2019 Angular Spa whith Asp.net core web api tmeplate.

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
Before usring SPA, I use asp.net core mvc page to implement UI. No state is store in browser, so bacically every operation in the browser will cause page sumbmitting and reloading.
for example, I have the following pages
- user-list.aspx
- user-edit.aspx
Every time a user entity was edited, the entire user-list.aspx need to refresh to apply the changes. that is a bad use expirence.

### with spa and State
while using SPA router and ajax, the page dosn't reload, the page only retrieves the partial data it needs(usually json). So it possible to save state in broswer.
- user-list page, the page cache all user entities
- user-edit page, it get user directly from cache, then it submit changes to backend, then it update the cache.

### ngRx
if the cache is a normal gobal array in javascript, the user-edit pag need to inform user-list page. that will make managing state in browser complex. With Angular ngRx, if a page change state, then all other page get informed by ngRX automatically.
## File struture 

- controlers
- ----------[model]Controller.cs
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
## workflow of Edit an entity
take the user entity as example
1. on user-list page, 
1.1 initialize model.datasource, when model.datasource is constructing, it subscribe to the selector 'selectInStore'
```
  this.store.pipe(
      select(selectInStore(this.type)),
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
```
1.2 user-list page subscripts to the entitySubject in model.datasource
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
2.1 model.service.ts gets invoked, then calls the web api
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

