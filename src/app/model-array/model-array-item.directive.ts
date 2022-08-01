import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[modelArrayItem]',
})
export class ModelArrayItem {
  constructor(public template: TemplateRef<any>) {}
}
