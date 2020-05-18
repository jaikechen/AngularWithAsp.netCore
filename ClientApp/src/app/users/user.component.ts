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
import { User } from './User';
import { AppState } from '../../_core/_store/app.reducer';
import { QueryParamsModel } from '../../_core/crud/query-params.model';
import {  GetPageRequested, ManyDeleteRequest, getManyDeleteRequest } from '../../_core/crud/model.action';
import { ConfirmDialogModel, createConfirmDialog } from '../_share/confirm.dialog.component';
import { selectActionLoading, selectError } from '../../_core/crud/model.selectors';
// Services and Model
@Component({
	selector: 'user-list',
	templateUrl: './user.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserComponent implements OnInit, OnDestroy {
	dataSource: ModelDataSource<User>;
  displayedColumns = ['select', 'userName', 'firstName', 'lastName','phoneNumber','role','actions'];

	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild('sort1', {static: true}) sort: MatSort;
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	selection = new SelectionModel<User>(true, []);
	result: User[] = [];
	private subscriptions: Subscription[] = [];
  serverError$: Observable<string>;
  actionLoading$: Observable<boolean>;


	

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
    private router: Router,
    private store: Store<AppState>
	) { }


	ngOnInit() {

    this.actionLoading$ = this.store.pipe( select(selectActionLoading(User)));
    this.serverError$ = this.store.pipe(select(selectError(User)), filter(x => !!x));

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
    this.dataSource = new ModelDataSource(User,this.store);
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
    this.store.dispatch(GetPageRequested(User, queryParams ));
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

	delete(_item: User) {
		const title: string = "Delete Item";
		const description: string = "Are you sure Delete this Item";
		const _waitDesciption: string = "Deleting";
		const _deleteMessage = "The Item was deleted";

    const dialogRef = createConfirmDialog(title, description, this.dialog);
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });

   
    
    /*
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new GuideOneDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
    */
	}

	/**
	 * Delete selected customers
	 */
	deleteItems() {

		const title: string = "Delete Items";
		const message: string = "Are you sure Delete these Items";
		const _waitDesciption: string = "Deleting";
		const _deleteMessage = "The Items was deleted";

    const dialogRef = createConfirmDialog(title, message, this.dialog);


		dialogRef.afterClosed().subscribe(res => {
      if (!!res) {
        const ids = this.selection.selected.map(x => x.id);
        this.store.dispatch(getManyDeleteRequest(User, ids));
			}

      /*
			const idsForDeletion: number[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new GuideManyDeleted({ ids: idsForDeletion }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.selection.clear();
      */
		});
	}

	/**
	 * Fetch selected customers
	 */
	fetch() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.firstName}`,
				id: elem.id.toString(),
			});
		});
		//this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Show UpdateStatuDialog for selected customers
	 */
	updateStatus() {
		const _title = "Update Item";
		const _updateMessage = "The item has been updated";
		const _statuses = [{ value: 0, text: 'Suspended' }, { value: 1, text: 'Active' }, { value: 2, text: 'Pending' }];
		const _messages = [];

		this.selection.selected.forEach(elem => {
			_messages.push({
				text: `${elem.firstName}`,
				id: elem.id.toString(),
			});
		});

    /*
		const dialogRef = this.layoutUtilsService.updateStatusForEntities(_title, _statuses, _messages);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update, 10000, true, true);
			this.selection.clear();
		});
    */
	}

	/**
	 * Show add customer dialog
	 */
  add() {
    this.router.navigate(['/users/add']);

	}

	edit(item: User) {

    this.router.navigate(['/guides/edit', item.id]);
//    this.router.navigate(['guides/edit', item.id], { relativeTo: this.activatedRoute });
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.result.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle all selections
	 */
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
