import { Component, OnInit } from '@angular/core';
import { Progres } from '../classes/progres';
import { ProgressService } from '../services/progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.sass']
})
export class ProgressComponent implements OnInit {
  progress: Progres[];
  showDelete: boolean = false;
  deleteItem: Progres;
  showEditProgress = false;
  progresEdit = null;
  constructor(private progressService: ProgressService, private router: Router) {}



  delete(el) {
    this.showDelete = true;
    this.showEditProgress = false;
    this.deleteItem = el;
  }
  cancel() {
    this.showDelete = false;
    this.deleteItem = null;
  }
  deleteProgres() {
    this.showDelete = false;
    this.progressService.deleteProgres(this.deleteItem.id).subscribe(data => {
      this.progress = this.progress.filter(item => item.id !== this.deleteItem.id);
    });
  }
  ngOnInit() {
    this.progressService.resetProgresData();
    this.progressService.getProgres().subscribe(response => {
      const data: any = response;
      this.progress = data;
    });
  }
  onClickEdit(progres) {
    this.showEditProgress = true;
    this.progresEdit = progres;
  }
}
