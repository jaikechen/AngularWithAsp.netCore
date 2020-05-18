import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm.dialog.component.html',
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
 
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
     ) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
  }
  
  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
 
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

export class ConfirmDialogModel {
 
  constructor(public title: string, public message: string) {
  }
}

export const createConfirmDialog = (title: string, message: string, dialog: MatDialog) => {

  const dialogData = new ConfirmDialogModel(title, message);
  const dialogRef = dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
  });
  return dialogRef;
}
