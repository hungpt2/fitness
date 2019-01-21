import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SettingService } from './services/setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  user = {};
  constructor(private settingService: SettingService, private router: Router) { }
  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.settingService.getSettingInfo().subscribe();
    }
  }
}
