import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-alert',
  templateUrl: './progress-alert.component.html',
  styleUrls: ['./progress-alert.component.sass']
})
export class ProgressAlertComponent implements OnInit {
  @Input() week = null;
  @Output() closeAlert = new EventEmitter();
  constructor() {}
  ngOnInit() {}
}
