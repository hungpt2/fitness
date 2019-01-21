import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { SignupService } from '../services/signup.service';
import { currentPassDate } from '../_helpers/timer';
const emailInvalid = 'ducle.sg@gmail.com';

@Component({
  selector: 'app-sign-up-email',
  templateUrl: './sign-up-email.component.html',
  styleUrls: ['./sign-up-email.component.sass']
})
export class SignUpEmailComponent implements OnInit {
  email: string;
  string;
  invalid: boolean = false;
  constructor(
    private signupService: SignupService,
    private router: Router,
    private _service: NotificationsService
  ) {}
  ngOnInit() {
    this.signupService.getListSku().subscribe();
  }
  onNext() {
    this.signupService.validateEmail(this.email).subscribe(
      data => {
        if (!data) {
          this._service.error('Error', 'Fail to get SKU');
          this.invalid = true;
        } else {
          
          this.signupService.getInfoSku(data).subscribe(
            (skuInfo: any) => {
              if (skuInfo) {
                if (
                  currentPassDate(skuInfo.start_registration_date || '2018-07-05')
                ) {
                  this.signupService.setFormData({ email: this.email, sku: data });
                  this.router.navigateByUrl('/sign-up');
                } else {
                  this._service.error('Error', 'This time is not registerable');
                }
              } else {
                this.signupService.setFormData({ email: this.email, sku: data });
                this.router.navigateByUrl('/sign-up');
              }
            },
            error => {
              this._service.error('Error', 'Do not found the package');
            }
          );
        }
      },
      error => {
        this._service.error('Error', 'Fail to get SKU');
        this.invalid = true;
      }
    );
  }
  onOk() {
    this.invalid = false;
    this.email = '';
  }
}
