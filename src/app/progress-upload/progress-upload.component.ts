import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { AWSService } from '../services/aws.service';
import { LocalStorageService } from '../services//local-storage.service';

import { Progres } from '../classes/progres';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-progress-upload',
  templateUrl: './progress-upload.component.html',
  styleUrls: ['./progress-upload.component.sass']
})
export class ProgressUploadComponent implements OnInit {
  @Input() progres: Progres;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  isCropping = false;
  showCropView = false; // boolean show Crop View
  cropperSettings: CropperSettings;
  data: any;
  imageUrl = null;
  imageUrl1 = null;
  imageUrl2 = null;
  isMakePhoto = false;
  isClickUpload2 = false;
  dataProgress: any = {};
  selectID = null;
  constructor(
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private location: Location,
    private aws: AWSService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.progres = new Progres();
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.preserveSize = false;
    this.cropperSettings.cropperDrawSettings.strokeColor = '#e70023';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.height = 200;
    this.cropperSettings.croppedHeight = 400;
    this.cropperSettings.fileType = 'image/jpeg';
    this.cropperSettings.compressRatio = 0.8;
    this.data = {};
    this.setCanvas();
  }
  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => {
          this.selectID = +params.get('id');
          if (this.selectID) {
            const progressListData = this.progressService.getProgressListData();
            if (!progressListData) {
              const progressListDataGet = this.progressService
                .getProgres()
                .subscribe(response => {
                  this.dataProgress = response.find(
                    item => item.id === this.selectID
                  );
                  if (this.dataProgress) {
                    this.processProgress(true);
                  } else {
                    this.router.navigateByUrl('/progress');
                  }
                });
            } else {
              this.dataProgress = progressListData.find(
                item => item.id === this.selectID
              );
              this.processProgress(true);
            }
          } else {
            this.dataProgress = this.progressService.getProgresData();
            this.processProgress();
          }
        })
      )
      .subscribe();
  }
  processProgress(isGetFromServer = false) {
    let photoAttribute = [];
    if (isGetFromServer) {
      photoAttribute = this.dataProgress.progress_photos;
    } else {
      photoAttribute = this.dataProgress.progress_photos_attributes;
    }
    if (!photoAttribute) {
      return;
    }
    if (photoAttribute.length === 2) {
      this.imageUrl1 = photoAttribute[1].photo_url || '';
      this.imageUrl2 = photoAttribute[0].photo_url || '';
      this.isMakePhoto = true;
    } else {
      this.imageUrl = photoAttribute[0].photo_url || '';
      this.imageUrl2 = '';
      this.isMakePhoto = false;
    }
  }
  save(): void {
    const data = [];
    let progress_photos_attributes;
    if (!this.selectID) {
      if (this.isMakePhoto) {
        data.push({ photo_url: this.imageUrl2 });
        data.push({ photo_url: this.imageUrl1 });
      } else {
        data.push({ photo_url: this.imageUrl });
      }
      progress_photos_attributes = data;
    } else {
      const { progress_photos } = this.dataProgress;
      if (this.isMakePhoto) {
        progress_photos[0].photo_url = this.imageUrl2;
        if (progress_photos[1]) {
          progress_photos[1].photo_url = this.imageUrl1;
        } else {
          progress_photos.push({ photo_url: this.imageUrl1 });
        }
      } else {
        progress_photos[0].photo_url = this.imageUrl;
        progress_photos[1] = null;
      }
      progress_photos_attributes = progress_photos;
    }

    this.progressService.saveProgresData({
      ...this.dataProgress,
      progress_photos_attributes: progress_photos_attributes
    });
  }

  goBack() {
    this.location.back();
  }
  onInputFileChange(event) {
    if (event.target.files.length === 0) return;
    this.showCropView = true;
    if (this.isMakePhoto) {
      this.cropperSettings.width = 100;
      this.cropperSettings.croppedWidth = 200;
    } else {
      this.cropperSettings.width = 200;
      this.cropperSettings.croppedWidth = 400;
    }
    const file: File = event.target.files[0];
    if (this.cropperSettings.allowedFilesRegex.test(file.name)) {
      const image: any = new Image();
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (loadEvent: any) => {
        image.addEventListener('load', () => {
          this.cropper.setImage(image);
        });
        image.src = loadEvent.target.result;
      };
      myReader.readAsDataURL(file);
    }
  }
  setCanvas() {
    if (window.innerWidth > 768) {
      this.cropperSettings.canvasWidth = 450;
      this.cropperSettings.canvasHeight = 270;
    } else {
      this.cropperSettings.dynamicSizing = true;
    }
  }
  submitCrop() {
    this.isCropping = true;
    this.aws
      .uploadImageBase64(this.data.image, this.localStorageService.getUserId())
      .then(url => {
        if (this.isMakePhoto && this.isClickUpload2) {
          this.imageUrl1 = url;
        } else if (this.isMakePhoto) {
          this.imageUrl2 = url;
        } else {
          this.imageUrl = url;
        }
        this.showCropView = false;
        this.isCropping = false;
      })
      .catch(error => {
        alert('Upload image fail.');
        this.showCropView = false;
        this.isCropping = false;
      });
  }
  removeImage(type) {
    if (type === 'image2') {
      this.imageUrl2 = null;
    } else if (type === 'image' && this.isMakePhoto) {
      this.imageUrl1 = null;
    } else {
      this.imageUrl = null;
    }
  }
  availableNext() {
    if (this.isMakePhoto) {
      if (this.imageUrl1 || this.imageUrl2) {
        return true;
      } else {
        return false;
      }
    } else {
      return this.imageUrl ? true : false;
    }
  }
}
