import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'deleteProgress'})
export class DeleteProgressPipe implements PipeTransform {

	transform(items: any[], categories: any[]): any {
		for(var i = 0; i < items.length; i++) {
				categories.push(items[i].title);
		  	categories = categories.filter(function(item, index, inputArray) {
		   	return inputArray.indexOf(item) == index;
		  });
		}
	 return categories;
	}

}