import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { getTimeDiff } from '../../_helpers/timer';

@Component({
  selector: 'app-dashboard-waiting',
  templateUrl: './dashboard-waiting.component.html',
  styleUrls: ['./dashboard-waiting.component.sass']
})
export class DashboardWaitingComponent implements OnInit {
  @Input() isSpecial = false;
  @Input() timeEnd;
  @Input() isSpecialOveload = false;
  @Input() hidePlanTemp = false;
  @Input() type = '';
  @Input() isExpired = false;
  @Input() skuLabel = '';
  timer: any;
  displayTime: any = {};
  @Output() zeroTrigger = new EventEmitter();
  constructor() {}
  ngOnInit() {
    if (((this.isSpecial && !this.hidePlanTemp) || (this.isSpecialOveload && !this.hidePlanTemp)) && !this.isExpired) {
      this.timer = setInterval(() => {
        this.displayTime = getTimeDiff(this.isSpecialOveload || this.timeEnd, () => {
          this.zeroTrigger.emit(true);
        });
      }, 1000);
    }
    if (!this.isSpecial) {
      const time = new Date(this.timeEnd);
      const newTime = time.setHours(time.getHours() + 24);
      this.timer = setInterval(() => {
        this.displayTime = getTimeDiff(newTime, () => {
          this.zeroTrigger.emit(true);
        });
      }, 60 * 1000);
    }
  }
}
