import { Component, OnInit } from '@angular/core';

import { SettingService } from '../services/setting.service';
import { Setting } from '../classes/setting';
import { getYears } from '../_helpers/generator';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {
  setting: Setting;
  date: any = {};
  password: any = {};
  unit_system = null;
  arrayYear: Array<number> = [];
  constructor(private settingService: SettingService, private _service: NotificationsService) {
    this.setting = new Setting();
  }
  ngOnInit() {
    this.arrayYear = getYears();
    this.settingService.getSettingInfo().subscribe(
      data => this.parseData(data),
      error => {
        this._service.error('Error', 'Fetch data fail');
      }
    );
  }
  parseData(data) {
    this.setting = data.user;
    this.setting.height = Math.round(this.setting.height);
    this.setting.weight = Math.round(this.setting.weight);
    this.setting.current_weight = Math.round(this.setting.current_weight || this.setting.weight);
    this.unit_system = this.setting.unit_system;
    if (this.setting.unit_system === 2) {
      this.setting.weight = convertKgtoLbs(this.setting.weight);
      this.setting.current_weight = convertKgtoLbs(this.setting.current_weight || this.setting.weight);
    }
    const dateObj = new Date(data.user.date_of_birth);
    this.date = {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear()
    };
  }

  onSubmit() {
    if (this.checkIsValidPassword()) {
      const date_of_birth = `${this.date.year}-${this.date.month}-${this.date.day}`;
      const user = { ...this.setting, date_of_birth };
      if (this.password.current) {
        user['current_password'] = this.password.current;
        user['password'] = this.password.newPassword;
      }
      if (this.unit_system === 2) {
        user.weight = convertLbstoKg(user.weight);
        user.current_weight = convertLbstoKg(user.current_weight);
      }
      const formData = { user: user };
      this.settingService.updateSetting(formData).subscribe(
        data => {
          this.parseData(data);
          this._service.success('Success', 'Successfull update user!');
        },
        error => {
          const message = error.error.errors[0].message;
          this._service.error('Error', message || 'Update user fail');
        }
      );
    }
  }
  checkIsValidPassword() {
    const { current, newPassword, newPasswordConfirm } = this.password;
    if (!current && !newPassword && !newPasswordConfirm) {
      return true;
    }
    if (current && newPassword && newPassword === newPasswordConfirm) {
      return true;
    }
  }
  onUpdateAvatar(files) {
    const { id } = this._service.info('Info', 'Uploading Avatar ...', {
      timeOut: 0,
      showProgressBar: true
    });
    this.settingService
      .uploadAvatar(files)
      .then(urlAvatar => {
        this.settingService.updateAvatar(urlAvatar).subscribe(
          data => {
            this.setting = data.user;
            this._service.remove(id);
            this._service.success('Success', 'Successfull update avatar user!');
          },
          error => {
            this._service.remove(id);
            this._service.error('Error', 'Update avatar fail');
          }
        );
      })
      .catch(error => {
        this._service.remove(id);
        this._service.error('Error', 'Upload avatar fail');
      });
  }
  onUnitSystemChange(value) {
    this.unit_system = parseInt(value);
    if (value === '1') {
      this.setting.height = Math.round(this.setting.height * 30.48 + this.setting.inch * 2.54);
      this.setting.weight = convertLbstoKg(this.setting.weight);
      this.setting.current_weight = convertLbstoKg(this.setting.current_weight);
    } else {
      const feet = Math.floor(this.setting.height / 30.48);
      const inch = Math.round((this.setting.height - feet * 30.48) / 2.54);
      this.setting.height = feet;
      this.setting.inch = inch;
      this.setting.weight = convertKgtoLbs(this.setting.weight);
      this.setting.current_weight = convertKgtoLbs(this.setting.current_weight);
    }
  }
}
function convertKgtoLbs(value) {
  if (!value) return null;
  return Math.round(value * 2.2046226218488);
}
function convertLbstoKg(value) {
  if (!value) return null;
  return Math.round(value / 2.2046226218488);
}
