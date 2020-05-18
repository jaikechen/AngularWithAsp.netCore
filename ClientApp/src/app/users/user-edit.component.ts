import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { delay, filter, first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { User } from './User';
import { AppState } from '../../_core/_store/app.reducer';
import { ModelService } from '../../_core/crud/model.service';
import { selectModelById,  selectPageLoading, selectActionLoading, selectActionResult} from '../../_core/crud/model.selectors';
import { getCreateRequest, getUpdateRequest, ACTION_SUCCESS } from '../../_core/crud/model.action';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent implements OnInit, OnDestroy {
  item: User;
  oldItem: User;

  ItemId$: Observable<number>;
  pageLoading$: Observable<boolean>;
  actionLoading$: Observable<boolean>;
  itemForm: FormGroup;
  hasFormErrors = false;
  serverError$: Observable<string>;

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
    this.actionLoading$ = this.store.pipe(select(selectActionLoading(User)));
    this.serverError$ = this.store.pipe(select(selectActionResult(User)), filter(x => !!x && x != ACTION_SUCCESS)); 
    this.createForm();

    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id && id > 0) {
        this.store.pipe(
          select(selectModelById(User,id))
        ).subscribe(result => {
          if (!!result) {
            this.loadItem(result);
          }
          else {
            this.modelService.getById(User, id).subscribe(res => {
              this.loadItem(res, true);
            });
          }
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

	 ngOnDestroy() {
   }

  createForm() {
    this.itemForm = this.itemFB.group({
      userName: ['',[ Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      password: [''],
    });

  }


  reset() {
    const item = Object.assign({}, this.oldItem);
    this.itemForm.patchValue(item);
    this.hasFormErrors = false;
    this.itemForm.markAsPristine();
    this.itemForm.markAsUntouched();
    this.itemForm.updateValueAndValidity();
  }

  onSumbit() {
   
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
    if (this.oldItem) {
      editedItem.id = this.oldItem.id;
    }
    if (editedItem.id > 0) {
      this.updateItem(editedItem);
    }
    else {
      this.addItem(editedItem);
    }
  }


  prepareItem(): User {
    const controls = this.itemForm.controls;
    const item = new User();

    item.userName = controls.userName.value;
    item.firstName = controls.firstName.value;
    item.lastName = controls.lastName.value;
    item.phoneNumber = controls.phoneNumber.value;
    item.role = controls.role.value;
    item.password = controls.password.value;
    return item;
  }


  addItem(_item: User) {
    this.store.dispatch(getCreateRequest(_item));
   this.store.pipe(
      delay(1),
      select(selectActionResult(User)),
      filter(x => x == ACTION_SUCCESS),
      first()
    ).subscribe(() => {
      alert("add succeed!");
      this.router.navigate(['/users']);
    });
  }

  updateItem(item: User) {
    const updateItem = {
      id: item.id,
      changes: item
    };

    this.store.dispatch(getUpdateRequest(item, updateItem));

    this.store.pipe(
      delay(1),
      select(selectActionResult(User)),
      filter(x => x == ACTION_SUCCESS),
      first()
    ).subscribe(() => {
      alert("update succeed!");
      this.router.navigate(['/users']);
    });
  }

  getComponentTitle() {
    return this.item && this.item.id ? `Edit user ${this.item.userName}`:'Add User'
  }

 }
