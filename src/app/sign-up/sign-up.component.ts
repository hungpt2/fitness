import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { NotificationsService } from 'angular2-notifications';
import { SettingService } from '../services/setting.service';
import { getYears } from '../_helpers/generator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
  signup: any = {
    unit_system: 1,
    gender: 'female',
    goal: 1,
    month: '',
    day: '',
    year: '',
    goal_weight: 0
  };
  isSpecial = false;
  skuInfo = null;
  arrayYear: Array<number> = [];
  meal_plan_types: Array<any> = null;
  skuInfoPlan = null;
  isShredShapeChallenge = false;
  constructor(
    private signupService: SignupService,
    private router: Router,
    private _service: NotificationsService,
    private settingService: SettingService
  ) {}

  ngOnInit() {
    this.arrayYear = getYears();
    const formData = this.signupService.getFormData();
    const skuInfo = this.signupService.skuInfo;
    this.skuInfoPlan = skuInfo;
    this.meal_plan_types = this.filterMealPlan();
    this.isSpecial = skuInfo.is_challenge;
    this.skuInfo = this.signupService.getPlanType();
    
    if (this.isSpecial) {
      this.signup.dietary_preference = 'regular';
    }
    if (!(formData && formData.email)) {
      this.router.navigateByUrl('/sign-up-email');
    }
    if (formData.sku === '8-week-shred-and-shape-challenge-2' || formData.sku === '8-week-lsf-100k-fit-challenge') {
      this.isShredShapeChallenge = true;
    }
    this.signup = { ...this.signup, ...formData };
  }
  onNext() {
    if (!this.isSpecial) {
      this.signupService.setFormData(this.signup);
      const { sku } = this.signup;
      if (this.skuInfo === 'training') {
        this.router.navigateByUrl('/sign-up-workout');
      } else {
        this.router.navigateByUrl('/sign-up-nutrition');
      }
    } else {
      this.signupService.register(this.signup).subscribe(
        data => {
          this._service.success('Success', 'Successfull create new user!');
          this.router.navigateByUrl('/dashboard');
          this.settingService.getSettingInfo().subscribe();
        },
        error => {
          const errorJson: any = error.error;
          const message =
            (errorJson.error && errorJson.error.message) ||
            errorJson.errors[0].message ||
            'Please check data input.';
          this._service.error('Error', message, { timeOut: 5000 });
        }
      );
    }
  }

  filterMealPlan() {
    if (
      this.skuInfoPlan.meal_plan_types &&
      this.skuInfoPlan.meal_plan_types.length
    ) {
      const unit_system = this.signup.unit_system;
      const mealPlan = this.skuInfoPlan.meal_plan_types.filter(item => {
        if (unit_system === 1 || unit_system === '1') {
          return item.metric_type === 'metric';
        } else if (unit_system === 2 || unit_system === '2') {
          return item.metric_type === 'imperial';
        }
      });
      if (mealPlan.length) {
        this.signup.meal_plan_type_id = mealPlan[0].id;
      }
      return mealPlan;
    }
    return null;
  }
  changeUnitSystem() {
    this.meal_plan_types = this.filterMealPlan();
  }
  selectMealPlan(id) {
    this.signup.meal_plan_type_id = id;
  }
}
