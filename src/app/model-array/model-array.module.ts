import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ModelArrayItem} from './model-array-item.directive';
import {ModelArrayComponent} from './model-array.component';
import {RequiredItemFieldValidator} from './required-item-field-validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ModelArrayComponent, ModelArrayItem, RequiredItemFieldValidator],
  exports: [ModelArrayComponent, ModelArrayItem, RequiredItemFieldValidator],
})
export class ModelArrayModule {}
