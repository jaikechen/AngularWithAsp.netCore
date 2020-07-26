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

## workflow of Edit an entity



