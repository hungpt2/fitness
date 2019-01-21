import { Component, OnInit, HostListener, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  close: boolean = false;
  root: any;
  @Input() hidePlan = false;
  user: any = {};
  meta: any = {};
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 992) {
      this.root.classList.remove('ls-container-toggle');
    }
  }

  constructor(
    private authenticatioinService: AuthenticationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private settingService: SettingService
  ) {
    this.hidePlan = this.localStorageService.hidePlan;
  }

  menuToggle() {
    if (window.innerWidth < 992) {
      this.close = this.close ? false : true;
      if (this.close) {
        this.root.classList.add('ls-container-toggle');
      } else {
        this.root.classList.remove('ls-container-toggle');
      }
      return this.close;
    }
    return this.close;
  }

  ngOnInit() {
    this.root = document.getElementsByClassName('ls-content')[0];
    this.userSubscription = this.settingService.currentUser.subscribe(userInfo => {
      this.user = userInfo;
      this.hidePlan = this.hidePlan || this.user.plan_ready === false;
      const { current_week, total_week } = this.user;
      if (total_week) {
        this.meta.current_week = current_week > total_week ? total_week : current_week;
      }
    });
  }
  logout() {
    this.authenticatioinService.logout().subscribe(data => {}, error => {});
    this.router.navigateByUrl('/login');
    localStorage.removeItem('currentUser');
    this.settingService.resetCurrentUser();
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
