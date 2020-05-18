import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { User } from './User';
import { AppState } from '../../_core/_store/app.reducer';
import { ModelService } from '../../_core/crud/model.service';
import { selectLastCreatedModelId, selectModelById, selectError, selectPageLoading, selectActionLoading } from '../../_core/crud/model.selectors';
import { Updated, getCreateRequest } from '../../_core/crud/model.action';

@Component({
  selector: 'user-edit',
  templateUrl: './user.edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public properties
  item: User;
  ItemId$: Observable<number>;
  oldItem: User;
  pageLoading$: Observable<boolean>;
  actionLoading$: Observable<boolean>;
  itemForm: FormGroup;
  hasFormErrors = false;
  serverError$: Observable<string>;

  theFile: File;
  imageIcon: string;
  private componentSubscriptions: Subscription;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private itemFB: FormBuilder,
    public dialog: MatDialog,
    private modelService: ModelService,

    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    
    this.pageLoading$ = this.store.pipe( select(selectPageLoading(User)));
    this.actionLoading$ = this.store.pipe( select(selectActionLoading(User)));
    this.serverError$ = this.store.pipe( select(selectError(User)), filter(x=>!!x), ); 

    /*
    this.item = {
      status:'ok',
      id:0,
      userName : "test@tt.com",
      firstName: "firstName",
      lastName: "lsastName",
      password: "Abcd1234!",
      role: "admin",
      phoneNumber:'333'
    };
    */
    this.item = new User();
    this.createForm();

    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.store.pipe(
          select(selectModelById(User,id))
        ).subscribe(result => {
          if (!result) {
            this.loadProductFromService(id);
            return;
          }
          this.loadItem(result);

        });
      }
    });

  }

  loadItem(_item, fromService: boolean = false) {
    this.item = _item;
    this.ItemId$ = of(_item.id);
    this.oldItem = Object.assign({}, _item);

    this.itemForm.patchValue(_item);

    if (fromService) {
      this.cdr.detectChanges();
    }
  }


  loadProductFromService(id:number) {
    this.modelService.getById(User,id).subscribe(res => {
      this.loadItem(res, true);
    });
  }

	 ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    this.itemForm = this.itemFB.group({
      userName: [this.item.userName,[ Validators.required, Validators.email]],
      firstName: [this.item.firstName, Validators.required],
      lastName: [this.item.lastName, Validators.required],
      phoneNumber: [this.item.phoneNumber, Validators.required],
      role: [this.item.role, Validators.required],
      password: [this.item.password, Validators.required],
    });

  }
  goBackWithoutId() {
    this.router.navigateByUrl('/guides', { relativeTo: this.activatedRoute });
  }

  refreshItem(isNew: boolean = false, id = 0) {
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/guides/edit/${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.item = Object.assign({}, this.oldItem);
    this.createForm();
    this.hasFormErrors = false;
    this.itemForm.markAsPristine();
    this.itemForm.markAsUntouched();
    this.itemForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
   
    this.hasFormErrors = false;
    const controls = this.itemForm.controls;
    if (this.itemForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }
    let editedItem = this.prepareItem();
    if (editedItem.id > 0) {
      this.updateItem(editedItem, withBack);
    }
    else {
      this.addItem(editedItem);
    }
  }


  prepareItem(): User {
    const controls = this.itemForm.controls;
    const _item = new User();

    _item.userName = controls.userName.value;
    _item.firstName = controls.firstName.value;
    _item.lastName = controls.lastName.value;
    _item.phoneNumber = controls.phoneNumber.value;
    _item.role = controls.role.value;
    _item.password = controls.password.value;
    return _item;
  }


  addItem(_item: User) {
    this.store.dispatch(getCreateRequest(_item));
    this.componentSubscriptions = this.store.pipe(
      delay(1),
      select(selectLastCreatedModelId(User)),
      filter(x=> !!x)
    ).subscribe(newId => {
      this.router.navigate(['/users']);
    });
  }

  updateItem(_item: User, withBack: boolean = false) {

    const updateItem = {
      id: _item.id,
      changes: _item
    };

    this.store.dispatch(new Updated({
      partialItems: updateItem,
      item: _item
    }));

    of(undefined).pipe(delay(1)).subscribe(() => { // Remove this line
      if (withBack) {
        this.goBackWithoutId()
      } else {
        const message = `Item successfully has been saved.`;
        alert(message);
        this.refreshItem(false);
      }
    }); 
  }

  getComponentTitle() {
    return this.item && this.item.id ? `Edit user ${this.item.userName}`:'Add User'
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
 }
