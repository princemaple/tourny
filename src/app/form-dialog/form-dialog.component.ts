import {CommonModule} from '@angular/common';
import {Component, Inject, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ControlContainer, FormsModule, NgForm} from '@angular/forms';

import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';

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
