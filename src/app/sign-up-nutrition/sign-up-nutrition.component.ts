import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { SettingService } from '../services/setting.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-sign-up-nutrition',
  templateUrl: './sign-up-nutrition.component.html',
  styleUrls: ['./sign-up-nutrition.component.sass']
})
export class SignUpNutritionComponent implements OnInit {
  days: any = 1;
  meals: any = 4;
  dietary_requirements: any = [];
  foodPreferences: any;
  foodPreferencesSelected = [];

  no_allergies: boolean = true;
  vegetarian: boolean = false;
  vegan: boolean = false;
  lactose_free: boolean = false;
  gluten_free: boolean = false;
  seafood_free: boolean = false;
  nut_free: boolean = false;

  constructor(
    private signupService: SignupService,
    private router: Router,
    private settingService: SettingService,
    private _service: NotificationsService
  ) {
    this.foodPreferences = {
      proteins: [],
      carbs: [],
      fruits: [],
      fats: []
    };
  }

  ngOnInit() {
    const formData = this.signupService.getFormData();
    if (!formData.email) {
      this.router.navigateByUrl('/sign-up');
    }
    const { days, meals, dietary_requirements = [] } = formData;
    dietary_requirements.indexOf('vegetarian') > -1 ? (this.vegetarian = true) : (this.vegetarian = false);
    dietary_requirements.indexOf('vegan') > -1 ? (this.lactose_free = true) : (this.vegan = false);
    dietary_requirements.indexOf('lactose_free') > -1 ? (this.lactose_free = true) : (this.lactose_free = false);
    dietary_requirements.indexOf('gluten_free') > -1 ? (this.gluten_free = true) : (this.gluten_free = false);
    dietary_requirements.indexOf('seafood_free') > -1 ? (this.seafood_free = true) : (this.seafood_free = false);
    dietary_requirements.indexOf('nut_free') > -1 ? (this.nut_free = true) : (this.nut_free = false);
    this.dietary_requirements = dietary_requirements;
    this.days = days || 1;
    this.meals = meals || 4;
    this.onSelect('init', false);
  }
  onNext() {
    const { days, meals, dietary_requirements } = this;

    this.signupService.setFormData({
      days,
      meals,
      dietary_requirements,
      food_preferences: this.foodPreferencesSelected
    });
    const skuInfo = this.signupService.getPlanType();
    if (skuInfo !== 'meals') {
      this.router.navigateByUrl('/sign-up-workout');
    } else {
      this.signupService.register().subscribe(
        data => {
          this._service.success('Success', 'Successfull create new user!');
          this.router.navigateByUrl('/dashboard');
          this.settingService.getSettingInfo().subscribe();
        },
        error => {
          const errorJson: any = error.error;
          const message =
            (errorJson.error && errorJson.error.message) || errorJson.errors[0].message || 'Please check data input.';
          this._service.error('Error', message, { timeOut: 5000 });
        }
      );
    }
  }
  onNoSelect() {
    if (this.no_allergies) {
      this.vegetarian = false;
      this.vegan = false;
      this.lactose_free = false;
      this.gluten_free = false;
      this.seafood_free = false;
      this.nut_free = false;
      this.dietary_requirements = [];
    }
  }
  onSelect(value, bool) {
    if (bool) {
      this.dietary_requirements.push(value);
      this.no_allergies = false;
    } else {
      this.dietary_requirements = this.dietary_requirements.filter(item => item !== value);
    }
    if (!this.dietary_requirements.length) {
      this.no_allergies = true;
    } else {
      this.no_allergies = false;
    }
    this.foodPreferencesSelected = [];
    this.foodPreferences = {
      proteins: [],
      carbs: [],
      fruits: [],
      fats: []
    };
    this.signupService.getFoodPreferences(this.dietary_requirements).subscribe(
      data => {
        this.foodPreferences = data;
      },
      error => {
        this.foodPreferencesSelected = [];
        this.foodPreferences = {
          proteins: [],
          carbs: [],
          fruits: [],
          fats: []
        };
      }
    );
  }
  onSelectedFood(id, bool) {
    if (bool) {
      this.foodPreferencesSelected.push(id);
    } else {
      this.foodPreferencesSelected = this.foodPreferencesSelected.filter(item => item !== id);
    }
  }
}
