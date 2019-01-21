import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Pikaday from 'pikaday/pikaday.js';
@Component({
  selector: 'app-picker-date',
  templateUrl: './picker-date.component.html',
  styleUrls: ['./picker-date.component.sass']
})
export class PickerDateComponent implements OnInit, AfterViewInit {
  pickerDate: Pikaday;
  @Output() closePopup = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  day_selected = null;
  constructor() {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.pickerDate = new Pikaday({
      field: document.getElementById('datepicker'),
      onSelect: () => {
        this.day_selected = this.pickerDate.toString();
      }
    });
  }
  onNext() {
    if (this.day_selected) {
      this.onSubmit.emit(this.day_selected);
    }
  }
}
