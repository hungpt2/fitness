import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Setting } from '../classes/setting';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { AWSService } from './aws.service';
const url = environment.API_URL;

@Injectable()
export class SettingService {
  private user = new BehaviorSubject<any>({});
  currentUser = this.user.asObservable();

  isSpecial = false;
  userId = null;
  apiUser = '/users/';
  meta: any = {};
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private aws: AWSService
  ) {
    this.user.next(this.localStorageService.getUserInfo());
  }
  getSettingInfo() {
    this.isSpecial = this.localStorageService.getIsSpecial();
    this.userId = this.localStorageService.getUserId();

    if (this.isSpecial) {
      this.apiUser = '/v2/users/';
    }
    return this.http.get(url + this.apiUser + this.userId).pipe(
      map(response => {
        const setting: any = response;
        this.user.next({ ...setting.user, ...setting.meta });
        this.meta = setting.meta;
        return setting;
      })
    );
  }
  updateSetting(formData) {
    return this.http.put(url + this.apiUser + this.userId, formData).pipe(
      map(response => {
        const setting: any = response;
        this.user.next({ ...setting.user, ...this.meta });
        return setting;
      })
    );
  }
  updateAvatar(urlAvatar) {
    return this.http
      .put(url + `/users/${this.userId}/update_avatar`, {
        avatar_path: urlAvatar,
        id: this.userId
      })
      .pipe(
        map(response => {
          const setting: any = response;
          this.user.next({ ...setting.user, ...this.meta });
          return setting;
        })
      );
  }
  uploadAvatar(files) {
    return this.aws.uploadImage(files, this.userId);
  }
  resetCurrentUser() {
    this.user.next({});
  }
}
