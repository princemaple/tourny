import {Component, ContentChild, Input, ChangeDetectionStrategy, Injector} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {CVA} from '../cva';
import {ModelArrayItem} from './model-array-item.directive';

@Component({
    selector: 'model-array',
    templateUrl: './model-array.component.html',
    styleUrls: ['./model-array.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ModelArrayComponent, multi: true }],
    standalone: false
})
export class ModelArrayComponent<T> extends CVA {
  @ContentChild(ModelArrayItem, {static: true}) item!: ModelArrayItem;

  readonly items = new BehaviorSubject<T[]>([]);

  injector = Injector.create({providers: [{provide: ControlContainer, useValue: null}]});

  @Input() render = true;
  @Input() compareWith: ((item: T) => any) | null = null;
  @Input() trackByFn: (index: number, item: T) => any = i => i;

  @Input()
  set value(v: T[]) {
    if (!v) {
      return;
    }
    this.items.next(v);
  }

  get value() {
    return this.items.value;
  }

  addItem(item: T, index?: number) {
    if (typeof index === 'number') {
      const clone = this.items.value.slice();
      clone.splice(index, 0, item);
      this.items.next(clone);
    } else {
      this.items.next([...this.items.value, item]);
    }

    this.handleChange(this.items.value);
  }

  delItem(item: T) {
    let items: T[];

    if (this.compareWith) {
      items = this.items.value.filter(i => this.compareWith!(i) !== this.compareWith!(item));
    } else {
      items = this.items.value.filter(i => i !== item);
    }

    this.items.next(items);
    this.handleChange(this.items.value);
  }

  emit() {
    this.handleChange(this.items.value.slice());
  }
}
