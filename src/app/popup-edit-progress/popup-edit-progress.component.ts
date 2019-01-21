import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Progres } from '../classes/progres';

@Component({
  selector: 'app-popup-edit-progress',
  templateUrl: './popup-edit-progress.component.html',
  styleUrls: ['./popup-edit-progress.component.sass']
})
export class PopupEditProgressComponent implements OnInit {

  @Output() closePopup = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Input()  progres: Progres[] = [];
  constructor() { }

  ngOnInit() {
  }

}
