import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

import { Progres } from '../classes/progres';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-progress-share',
  templateUrl: './progress-share.component.html',
  styleUrls: ['./progress-share.component.sass']
})
export class ProgressShareComponent implements OnInit {
  @Input() progres: Progres;
  photo1: any = null;
  photo2: any = null;
  multiPhoto = false;
  dataProgress: any = {};
  selectID = null;
  constructor(
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private _service: NotificationsService
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
      this.multiPhoto = false;
    }
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
    if (this.selectID) {
      delete progresData.progress_photos;
      delete progresData.photo;
      this.progressService
        .editProgress({ post: progresData }, this.selectID)
        .subscribe(data => {
          const response: any = data;
          if (response.error) {
            const message = response.error.message;
            this._service.error('Error', message || 'Fetch data fail');
          } else {
            const url =
              this.selectID > 0
                ? '/progress-share/' + this.selectID
                : '/progress-share';
            this.router.navigateByUrl(url);
          }
        });
    } else {
      this.progressService
        .postProgres({ post: progresData })
        .subscribe(data => {
          const response: any = data;
          if (response.error) {
            const message = response.error.message;
            this._service.error('Error', message || 'Fetch data fail');
          } else {
            const url =
              this.selectID > 0
                ? '/progress-share/' + this.selectID
                : '/progress-share';
            this.router.navigateByUrl(url);
          }
        });
    }

    this.progressService.resetProgresData();
  }

  goBack() {
    this.location.back();
  }
}
