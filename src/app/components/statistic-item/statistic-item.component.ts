import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-statistic-item',
  templateUrl: './statistic-item.component.html',
  styleUrls: ['./statistic-item.component.sass']
})
export class StatisticItemComponent implements OnInit {
  @Input() statistic = null;
  @Input() title = '';
  @Input() icon = null;

  constructor() {}

  ngOnInit() {}
}
