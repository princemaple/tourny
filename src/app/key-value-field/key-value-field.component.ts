import {Component, Host, Input, Optional} from '@angular/core';
import {NgControl} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {orderBy} from 'lodash-es';

import {CVA} from '../cva';

@Component({
  selector: 'key-value',
  templateUrl: './key-value-field.component.html',
  styleUrls: ['./key-value-field.component.css'],
})
export class KeyValueFieldComponent extends CVA {
  @Input() title = 'Extra Info';
  @Input() addButtonText = 'Add';

  #expanded = false;
  @Input()
  get expanded() {
    return this.#expanded;
  }
  set expanded(v: boolean | string) {
    this.#expanded = coerceBooleanProperty(v);
  }

  #fieldsOnly = false;
  @Input()
  get fieldsOnly() {
    return this.#fieldsOnly;
  }
  set fieldsOnly(v: boolean | string) {
    this.#fieldsOnly = coerceBooleanProperty(v);
  }

  _value: [string, string][] = [];
  @Input()
  get value() {
    return Object.fromEntries(this._value.filter(([k, _v]) => k));
  }
  set value(v: {[key: string]: string}) {
    if (v) {
      this._value = orderBy(Object.entries(v), ([k, _v]) => k);
    }
  }

  constructor(@Optional() @Host() private ngControl: NgControl) {
    super();

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  commit() {
    this.handleChange(this.value);

    if (this.ngControl && this._value.some(([k, v]) => !v || !k)) {
      this.ngControl.control?.setErrors({kv: 'missing'});
    }
  }

  addKey() {
    this._value.push(['', '']);
    this.commit();
  }

  deleteKey(key: string) {
    this._value = this._value.filter(([k, _v]) => k !== key);
    this.commit();
  }

  trackByFn(index: number, _item: [string, string]) {
    return index;
  }
}
