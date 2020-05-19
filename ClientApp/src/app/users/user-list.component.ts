// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';

import { debounceTime, distinctUntilChanged, tap, skip, delay, take, filter } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of, Observable } from 'rxjs';
import { Store, select  } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelDataSource } from '../../_core/crud/model.datasource';
import { User, USER_TYPE } from './User';
import { AppState } from '../../_core/_store/app.reducer';
import { QueryParamsModel } from '../../_core/crud/query-params.model';
import {  getPageRequested, ManyDeleteRequest, getManyDeleteRequest, DeleteRequst, getDeleteRequest, ACTION_SUCCESS } from '../../_core/crud/model.action';
import { ConfirmDialogModel, createConfirmDialog } from '../_share/confirm.dialog.component';
import { selectActionLoading, selectActionResult,  } from '../../_core/crud/model.selectors';
// Services and Model
@Component({
	selector: 'user-list',
  templateUrl: './user-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserListComponent implements OnInit, OnDestroy {
	dataSource: ModelDataSource;
  displayedColumns = ['select', 'userName', 'firstName', 'lastName','phoneNumber','role','actions'];

	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	selection = new SelectionModel<User>(true, []);
	result: User[] = [];
  serverError$: Observable<string>;
  actionLoading$: Observable<boolean>;

	private subscriptions: Subscription[] = [];

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
    private router: Router,
    private store: Store<AppState>
	) { }


	ngOnInit() {

    this.actionLoading$ = this.store.pipe(select(selectActionLoading(USER_TYPE)));
    this.serverError$ = this.store.pipe(select(selectActionResult(USER_TYPE)), filter(x => !!x && x != ACTION_SUCCESS));

		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadList(false))
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(50), 
			distinctUntilChanged(), 
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadList(false);
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

    // Init DataSource
    this.dataSource = new ModelDataSource(USER_TYPE,this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.result = res;
		});
		this.subscriptions.push(entitiesSubscription);
		of(undefined).pipe(take(1), delay(1)).subscribe(() => { 
			this.loadList(true);
		});
		
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadList(sortById:boolean) {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      sortById ? "desc":	this.sort.direction,
			sortById ? "id": this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize,
			
    );
    this.store.dispatch(getPageRequested(USER_TYPE, queryParams));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = [];
		const searchText: string = this.searchInput.nativeElement.value;

		if (!searchText) {
			return filter;
		}
		filter.push({
			name: "name",
			value: searchText
		});
		//filter.name = searchText;
		return filter;
	}

	delete(item: User) {
		const title: string = "Delete Item";
		const description: string = "Are you sure Delete this Item";

    const dialogRef = createConfirmDialog(title, description, this.dialog);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!!dialogResult) {
        this.store.dispatch(getDeleteRequest(USER_TYPE,item.id))
      }
    });
 	}

	deleteItems() {

		const title: string = "Delete Items";
		const message: string = "Are you sure Delete these Items";
    const dialogRef = createConfirmDialog(title, message, this.dialog);
		dialogRef.afterClosed().subscribe(res => {
      if (!!res) {
        const ids = this.selection.selected.map(x => x.id);
        this.store.dispatch(getManyDeleteRequest(USER_TYPE, ids));
			}
		});
	}

	fetch() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.firstName}`,
				id: elem.id.toString(),
			});
		});
	}


   add() {
    this.router.navigate(['/users/add']);

	}

	edit(item: User) {

    this.router.navigate(['/users/edit', item.id]);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.result.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.result.length) {
			this.selection.clear();
		} else {
			this.result.forEach(row => this.selection.select(row));
		}
	}

	/** UI */
	/**
	 * Retursn CSS Class Name by status
	 *
	 * @param status: number
	 */
	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return 'danger';
			case 1:
				return 'success';
			case 2:
				return 'metal';
		}
		return '';
	}

	/**
	 * Returns Item Status in string
	 * @param status: number
	 */
	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return 'Suspended';
			case 1:
				return 'Active';
			case 2:
				return 'Pending';
		}
		return '';
	}

	/**
	 * Returns CSS Class Name by type
	 * @param status: number
	 */
	getItemCssClassByType(status: number = 0): string {
		switch (status) {
			case 0:
				return 'accent';
			case 1:
				return 'primary';
			case 2:
				return '';
		}
		return '';
	}

	



}
