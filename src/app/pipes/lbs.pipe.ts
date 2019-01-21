import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lbs'
})
export class LbsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return Number((value * 0.0352739619).toFixed(1));
  }
}
