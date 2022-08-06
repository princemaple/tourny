import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'apply'})
export class ApplyPipe implements PipeTransform {
  transform(value: any, fn: Function, ...args: any[]): unknown {
    return value != null ? fn(value, ...args) : value;
  }
}
