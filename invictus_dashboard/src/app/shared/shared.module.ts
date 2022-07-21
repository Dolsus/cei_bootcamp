import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DefaultDialogComponent } from './default-dialog.component';

@NgModule({
  declarations: [DefaultDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DefaultDialogComponent
    ]
})
export class SharedModule { }
