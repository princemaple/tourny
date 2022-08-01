import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[requiredItemField]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RequiredItemFieldValidator,
      multi: true,
    },
  ],
})
export class RequiredItemFieldValidator implements Validator {
  #fields: string[] = [];
  @Input('requiredItemField')
  set requiredItemField(f: string | string[]) {
    this.#fields = Array.isArray(f) ? f : f.split(',');
  }

  validate(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return (control.value as any[]).every(item => this.#fields.every(f => !!item[f]))
      ? null
      : {requiredItemField: `${this.#fields.join(', ')} are required`};
  }
}
