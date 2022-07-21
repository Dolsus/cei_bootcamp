import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'default-dialog',
  template: `<h1 mat-dialog-title>Warning</h1>
    <div mat-dialog-content>
      {{data}}
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onBtnClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Confirm
      </button>
    </div>`,
})
export class DefaultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DefaultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  onBtnClick(): void {
    this.dialogRef.close();
  }
}
