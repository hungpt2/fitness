import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private currentUser: any;
  hidePlan = false;
  hidePlanStart = false;
  isBooty = false;
  isHidePopupProgress = false;
  public getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      return null;
    }
    return currentUser.meta.jwt;
  }
  constructor() {
    this.loadLocalStage();
    this.isHidePopupProgress =
      localStorage.getItem('hidePopupProgress') === 'true';
  }
  private loadLocalStage() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  getUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser && currentUser.user && currentUser.user.id;
  }
  getCreateAt() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return (
      (currentUser && currentUser.user && currentUser.user.created_at) || null
    );
  }
  getIsSpecial() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const sku_type =
      (currentUser && currentUser.user && currentUser.user.sku_type) || null;
    this.isBooty = sku_type === 'booty-challenge';
    return sku_type === 'challenge' || sku_type === 'booty-challenge';
  }
  resetLocalStorage() {
    this.currentUser = null;
  }
  getHidePlanStart() {
    return localStorage.getItem('hidePlanStart') === 'true';
  }
  getUserInfo() {
    return (this.currentUser && this.currentUser.user) || {};
  }
  setHidePopupProgress() {
    localStorage.setItem('hidePopupProgress', 'true');
  }
}
