import { Component, OnInit, Input } from '@angular/core';
import { Tip } from '../classes/tip';
import { TipsService } from '../services/tips.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.sass']
})
export class TipsComponent implements OnInit {
  tips: any = [];
  filterBy?: any = 'all';
  cat_var: any;
  categories: any = ['All'];

  constructor(private tipsService: TipsService, private settingService: SettingService) {}

  getTips(week = 1): void {
    this.tipsService.getTips(week).subscribe(response => {
      const data: any = response;
      this.cat_var = data.articles;
      this.tips = data.articles;
      this.getCategory();
    });
  }

  getCategory() {
    for (var i = 0; i < this.cat_var.length; i++) {
      this.categories.push(this.cat_var[i].category);
      this.categories = this.categories.filter(function(item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
    }
  }

  ngOnInit() {
    this.settingService.currentUser.subscribe(data => {
      this.getTips(data.current_week);
    });
  }
  filterTipBy(cat) {
    this.filterBy = cat;
    if (cat === 'All') {
      this.tips = this.cat_var;
    } else {
      this.tips = this.cat_var.filter(item => item.category === cat);
    }
  }
}
