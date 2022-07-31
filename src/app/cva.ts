import {ControlValueAccessor} from '@angular/forms';
import {Input, Directive} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Directive()
export abstract class CVA implements ControlValueAccessor {
  protected _changeHanlder?: (v: any) => void;
  protected _touchHanlder?: () => void;
  protected _touched: boolean = false;

  abstract value: any;

  #disabled = false;
  @Input()
  get disabled(): boolean {
    return this.#disabled;
  }
  set disabled(v: boolean | string) {
    this.#disabled = coerceBooleanProperty(v);
  }

  #autoFocus = false;
  @Input()
  get autoFocus(): boolean {
    return this.#autoFocus;
  }
  set autoFocus(v: boolean | string) {
    this.#autoFocus = coerceBooleanProperty(v);
  }

  #readonly = false;
  @Input()
  get readonly(): boolean {
    return this.#readonly;
  }
  set readonly(v: boolean | string) {
    this.#readonly = coerceBooleanProperty(v);
  }

  #required = false;
  @Input()
  get required(): boolean {
    return this.#required;
  }
  set required(v: boolean | string) {
    this.#required = coerceBooleanProperty(v);
  }

  writeValue(value: any) {
    this.value = value;
  }

  handleChange(value: any) {
    if (this._changeHanlder instanceof Function) {
      this._changeHanlder(value);
    }
  }

  handleTouch() {
    if (this._touched) {
      return;
    }

    this._touched = true;

    if (this._touchHanlder instanceof Function) {
      this._touchHanlder();
    }
  }

  registerOnChange(fn: (v: any) => void) {
    this._changeHanlder = fn;
  }

  registerOnTouched(fn: () => void) {
    this._touchHanlder = fn;
  }

  setDisabledState(v: boolean) {
    this.disabled = v;
  }
}
