import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: '[modelArrayItem]',
    standalone: false
})
export class ModelArrayItem {
  constructor(public template: TemplateRef<any>) {}
}
