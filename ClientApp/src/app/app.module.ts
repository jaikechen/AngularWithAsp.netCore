import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialUIComponent } from './MaterialUIComponent';
import { MainNavComponent } from './main-nav/main-nav.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from '../_core/_store/app.reducer';
import { ModelEffect } from '../_core/crud/model.effects';
import { ConfirmDialogComponent } from './_share/confirm.dialog.component';
import { UserListComponent } from './users/user-list.component';
import { UserEditComponent } from './users/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    UserListComponent,
    UserEditComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([ModelEffect]),

    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent, pathMatch: 'full', canActivate: [AuthorizeGuard]
      },
      {
        path: 'users',
        component: UserListComponent, pathMatch: 'full', canActivate: [AuthorizeGuard]
      },
       {
        path: 'users/add',
        component: UserEditComponent, pathMatch: 'full', canActivate: [AuthorizeGuard]
      },
      {
        path: 'users/edit/:id',
        component: UserEditComponent, pathMatch: 'full', canActivate: [AuthorizeGuard]
      },
    ]),
    BrowserAnimationsModule,
    MaterialUIComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
   entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
