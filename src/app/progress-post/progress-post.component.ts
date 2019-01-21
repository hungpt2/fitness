import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

import { Progres } from '../classes/progres';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-progress-post',
  templateUrl: './progress-post.component.html',
  styleUrls: ['./progress-post.component.sass']
})
export class ProgressPostComponent implements OnInit {
  @Input() progres: Progres;
  selectImg: any = null;
  photo1: any = {};
  photo2: any = {};
  multiPhoto = false;
  dataProgress: any = {};
  selectID = null;
  constructor(
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => {
          this.selectID = +params.get('id');
          if (this.selectID) {
            const progressListData = this.progressService.getProgressListData();
            if (!progressListData) {
              this.router.navigateByUrl('/progress');
            }
          }
          this.dataProgress = this.progressService.getProgresData();
          this.processProgress();
        })
      )
      .subscribe();
  }
  processProgress(isGetFromServer = false) {
    let photoAttribute = [];
    if (this.selectID) {
      photoAttribute = this.dataProgress.progress_photos;
    } else {
      photoAttribute = this.dataProgress.progress_photos_attributes;
    }
    if (!photoAttribute) {
      this.router.navigateByUrl('/progress');
      return;
    }
    if (photoAttribute.length === 2 && photoAttribute[1]) {
      this.photo2 = photoAttribute[1];
      this.photo1 = photoAttribute[0];
      this.multiPhoto = true;
    } else {
      this.photo1 = photoAttribute[0];
      this.photo2 = {};
      this.multiPhoto = false;
    }
    this.selectImg = this.photo1;
  }
  save(): void {
    const progresData = { ...this.dataProgress };
    if (this.multiPhoto) {
      progresData.progress_photos_attributes = {
        0: this.photo1,
        1: this.photo2
      };
    } else {
      progresData.progress_photos_attributes = { 0: this.photo1 };
    }
    this.progressService.saveProgresData(this.dataProgress);
  }
  selectimg(el) {
    if (el === 'left') {
      this.selectImg = this.photo1;
    } else {
      this.selectImg = this.photo2;
    }
  }

  changeValue(val: number, op) {
    if (op === 'reduce') {
      val = Number(val) - 1;
      return val;
    } else {
      val = Number(val) + 1;
      return val;
    }
  }

  goBack() {
    this.location.back();
  }
}
