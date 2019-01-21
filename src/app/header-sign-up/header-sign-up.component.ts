import { Component, OnInit, Input } from '@angular/core';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-header-sign-up',
  templateUrl: './header-sign-up.component.html',
  styleUrls: ['./header-sign-up.component.sass']
})
export class HeaderSignUpComponent implements OnInit {
  @Input() step = 1;
  skuInfo = '';
  constructor(private signupService: SignupService) {}

  ngOnInit() {
    this.skuInfo = this.signupService.getPlanType();
  }
}
