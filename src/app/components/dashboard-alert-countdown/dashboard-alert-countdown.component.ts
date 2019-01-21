import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { getTimeDiff } from '../../_helpers/timer';

@Component({
  selector: 'app-dashboard-alert-countdown',
  templateUrl: './dashboard-alert-countdown.component.html',
  styleUrls: ['./dashboard-alert-countdown.component.sass']
})
export class DashboardAlertCountdownComponent implements OnInit {
  timer: any;
  displayTime: any = {};
  @Input() timeEnd = '';
  @Output() zeroTrigger = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.timer = setInterval(() => {
      this.displayTime = getTimeDiff(this.timeEnd, () => {
        this.zeroTrigger.emit(true);
      });
    }, 1000);
  }
}
