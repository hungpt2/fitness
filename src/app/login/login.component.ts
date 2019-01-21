import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { SignupService } from '../services/signup.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  remember: boolean = false;
  login: any = {};
  returnUrl: string;
  isFetching = false;
  constructor(
    private authenticatioinService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private _service: NotificationsService,
    private signupService: SignupService,
    private settingService: SettingService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (localStorage.getItem('currentUser')) {
      if (this.returnUrl !== '/') {
        this.router.navigate([this.returnUrl]);
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    }
  }
  onSubmit() {
    if (this.isFetching) {
      return;
    }
    this.isFetching = true;
    this.authenticatioinService.login(this.login).subscribe(
      data => {
        if (this.returnUrl !== '/') {
          this.settingService.getSettingInfo().subscribe();
          this.router.navigate([this.returnUrl]);
        } else {
          this.settingService.getSettingInfo().subscribe();
          this.router.navigateByUrl('/dashboard');
        }
      },
      error => {
        const message = error.error.errors[0].message;
        this._service.error('Error', message || 'Fetch data fail');
        setTimeout(() => {
          this.isFetching = false;
        }, 1000);
      }
    );
  }
}
