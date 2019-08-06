import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], obj): any {
        //console.log('items', items);
        return obj.propertyValue ? items.filter(item => item[obj.propertyName] === obj.propertyValue):null;
        
       
    }
}