import {Pipe, PipeTransform} from '@angular/core';

import {orderBy} from 'lodash-es';

@Pipe({
    name: 'sort',
    standalone: false
})
export class SortPipe implements PipeTransform {
  transform<T>(value: T[] | Set<T> | null | undefined, properties: string[]): T[];
  transform<T>(value: T[] | Set<T> | null | undefined, ...properties: string[]): T[];
  transform<T>(value: T[] | Set<T> | null | undefined, ...properties: string[] | string[][]): T[] {
    let props: string[];
    if (properties.length == 1 && Array.isArray(properties[0])) {
      props = properties[0];
    } else {
      props = properties as string[];
    }

    if (!value || props.some(p => !p)) {
      return Array.from(value || []);
    }

    const orders = props.map(p => (p.startsWith('-') ? 'desc' : 'asc'));
    props = props.map(p => p.replace(/^-/, ''));
    return orderBy(value instanceof Array ? value : Array.from(value), props, orders);
  }
}
