import {CommonModule} from '@angular/common';
import {Component, Inject, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

export type Field = {name: string} & Partial<{
  type: string;
  label: string;
  placeholder: string;
  suffix: string;
  default: any;
  options: any[];
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  min: number;
  max: number;
}>;

export type TemplateData = {
  title: string;
  fields: Field[];
  otherFields: TemplateRef<any>;
  otherContext: any;
  submitText?: string;
  cancelText?: string;
};

@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
  ],
})
export class FormDialogComponent implements OnInit {
  @ViewChild(NgForm, {static: true}) form!: NgForm;

  injector!: Injector;

  constructor(public ref: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: TemplateData) {}

  ngOnInit(): void {
    this.injector = Injector.create({
      providers: [{provide: ControlContainer, useValue: this.form}],
    });
  }
}
