import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tipsFilter'})
export class TipsFilterPipe implements PipeTransform {
	
	transform(items: any[], criteria: string): any {
		if(criteria === 'all') { 
			return items;
		} else {
			return items.filter(item => {
				return item.title === criteria;
			});
		}
	}

}
