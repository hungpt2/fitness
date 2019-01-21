import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../services/progress.service';
import { MealsService } from '../services/meals.service';
import { WorkoutService } from '../services/workout.service';
import { DashboardService } from '../services/dashboard.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SignupService } from '../services/signup.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  progress: any = [];
  meal: any = null;
  meals: any = {};
  workouts: any = {};
  tip: any = null;
  openAlert = false;

  progres_slice1: number;
  progres_slice2: number;
  statistic: any = {};
  hidePlan = false;
  hidePlanStart = false;
  unit_system = null;
  isSpecial = false;
  shred_challenge_start_at = null;
  isSpecialOveload = null;
  hidePlanTemp = false;
  showPopupDate = false;
  day_number = null;
  week_number = null;
  showEditProgress = false;
  progresEdit = null;
  showDelete = false;
  deleteItem = null;
  showButtonStartPlan = false;
  planReady = false;
  dateSignupNormal = null;
  isExpired: Boolean = false;
  showStartPlanModal = false;
  skuLabel: String = '';
  isBooty = false;
  hideModalstartPlan = false;

  constructor(
    private progressService: ProgressService,
    private dashboardService: DashboardService,
    private localStorageService: LocalStorageService,
    private settingService: SettingService
  ) {}
  handelHidePlan(userInfo: any = {}) {
    if (this.isSpecial) {
      const dateCurrent: any = new Date();
      // const dateCurrent: any = new Date('2018-01-20T02:25:00.000Z');
      const dateWillLaunch = new Date(this.shred_challenge_start_at);
      const dateSignup = this.localStorageService.getCreateAt();
      // const dateSignup = '2018-01-20T02:05:00.000Z';
      const dateSign: any = new Date(dateSignup);
      const _15_MINUTES = 15 * 60 * 1000; /* ms */
      const datePlanStart = new Date('2018-01-21T22:00:00.000Z');
      if (dateCurrent < dateWillLaunch && !this.isBooty) {
        this.hidePlan = true;
        this.localStorageService.hidePlan = true;
      } else if (dateCurrent - dateSign <= _15_MINUTES) {
        dateSign.setMinutes(dateSign.getMinutes() + 15);
        this.isSpecialOveload = dateSign.toString();
        this.hidePlan = true;
        this.localStorageService.hidePlan = true;
      } else if (dateCurrent < dateWillLaunch) {
        this.hidePlanStart = true;
        // this.hidePlanTemp = true;
        this.localStorageService.hidePlanStart = true;
        localStorage.setItem('hidePlanStart', 'true');
      }
    } else {
      const dateSignup = this.localStorageService.getCreateAt();
      const dateSign = new Date(dateSignup);
      const dateNow = Date.now();
      const difference = dateNow - dateSign.getTime(); // This will give difference in milliseconds
      const resultInMinutes = Math.round(difference / 60000);
      if (!dateSignup || resultInMinutes < 60 * 24) {
        this.hidePlan = true;
        this.localStorageService.hidePlan = true;
        this.dateSignupNormal = dateSignup;
      } else if (!this.planReady) {
        this.hidePlan = true;
        this.localStorageService.hidePlan = true;
        this.showButtonStartPlan = true;
      } else {
        this.hidePlan = false;
        this.localStorageService.hidePlan = false;
      }
    }
    const { current_week, total_week } = userInfo;
    if (total_week && current_week > total_week) {
      this.isExpired = true;
    }
  }
  ngOnInit() {
    this.isSpecial = this.localStorageService.getIsSpecial();
    this.dashboardService.getDashboard(this.isSpecial).subscribe(data => {
      this.statistic = this.caculateStatistic(data.meal_statistic);
      this.meal = data.today_meals.meal || {};
      this.meals = data.today_meals;
      this.workouts = data.workouts || { name: '' };
      this.tip = data.tip;
      this.progress = data.latest_posts;
      this.day_number = data.day_number;
      this.week_number = data.week_number;

      if (this.isSpecial) {
        this.meal.sum_nutrients =
          data.today_meals.daily_nutrients_for_recipes || {};
        this.workouts.image_url = this.workouts.name
          ? `http://res.cloudinary.com/ddsadubut/image/upload/workout-day/${this.workouts.name
              .replace('&', ' ')
              .replace(/\s+/g, '_')}.jpg`
          : '';
      }
    });
    this.settingService.currentUser.subscribe(data => {
      this.caculatorShowPrgoressAlert(data);
      this.unit_system = data.unit_system;
      this.planReady = data.plan_ready;
      this.skuLabel = data.sku_label;
      this.planReady = data.plan_ready;
      this.isBooty = data.sku_type === 'booty-challenge';
      const dateShred = new Date(data.shred_challenge_start_at);
      // dateShred.setDate(dateShred.getDate() - 4 );
      this.shred_challenge_start_at = dateShred.toString();
      this.handelHidePlan(data);
    });
  }
  caculatorShowPrgoressAlert(data) {
    const dateUploaded = data.last_uploaded_at || data.created_at;
    const dateSign = new Date(dateUploaded);
    const dateNow = Date.now();
    const difference = dateNow - dateSign.getTime();
    const resultInDay = Math.round(difference / 86400000);
    if (resultInDay > 7 && !this.localStorageService.isHidePopupProgress) {
      this.openAlert = true;
    }
  }
  caculateStatistic(data) {
    if (!data) {
      return this.isSpecial ? {} : {};
    }
    data.calories.percent =
      Math.round((data.calories.done / data.calories.total) * 100) || 0;
    data.calories.done = Math.round(data.calories.done);
    data.calories.total = Math.round(data.calories.total);
    data.carb.percent =
      Math.round((data.carb.done / data.carb.total) * 100) || 0;
    data.carb.done = Math.round(data.carb.done);
    data.carb.total = Math.round(data.carb.total);
    data.protein.percent =
      Math.round((data.protein.done / data.protein.total) * 100) || 0;
    data.protein.done = Math.round(data.protein.done);
    Math.round(data.protein.total);
    data.fat.percent = Math.round((data.fat.done / data.fat.total) * 100) || 0;
    data.fat.done = Math.round(data.fat.done);
    data.fat.total = Math.round(data.fat.total);
    if (this.hidePlan) {
      data.calories.total = 0;
      data.carb.total = 0;
      data.protein.total = 0;
      data.fat.total = 0;
    }
    return data;
  }
  shareFacebook(progres) {
    if (!progres.photo) {
      return;
    }
    const url = progres.photo;
    window.open(
      'http://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
      ''
    );
  }
  triggerShowPlan() {
    this.hidePlan = false;
    this.handelHidePlan();
    this.localStorageService.hidePlan = false;
    if (!this.isSpecial) {
      this.showButtonStartPlan = true;
    }
    this.refreshDashboard();
  }
  triggerShowPlanStart() {
    this.hidePlanStart = false;
    this.isSpecialOveload = null;
    this.localStorageService.hidePlanStart = false;
    localStorage.removeItem('hidePlanStart');
    this.refreshDashboard();
  }
  onSelectDay(day_select) {
    this.showPopupDate = false;
    this.dashboardService
      .getDashboard(this.isSpecial, day_select)
      .subscribe(data => {
        if (data.error) {
          alert('statistics not found for this date: ' + day_select);
          return;
        }
        this.statistic = this.caculateStatistic(data.meal_statistic);
        this.meal = data.today_meals.meal || {};
        this.meals = data.today_meals;
        this.workouts = data.workouts || { name: '' };
        this.tip = data.tip;
        this.progress = data.latest_posts;
        this.day_number = data.day_number;
        this.week_number = data.week_number;
        if (this.isSpecial) {
          this.meal.sum_nutrients =
            data.today_meals.daily_nutrients_for_recipes || {};
          this.workouts.image_url = this.workouts.name
            ? `http://res.cloudinary.com/ddsadubut/image/upload/workout-day/${this.workouts.name
                .replace('&', ' ')
                .replace(/\s+/g, '_')}.jpg`
            : '';
        }
      });
  }
  onClickEdit(progres) {
    this.showEditProgress = true;
    this.progresEdit = progres;
  }
  delete(el) {
    this.showDelete = true;
    this.showEditProgress = false;
    this.deleteItem = el;
  }
  cancel() {
    this.showDelete = false;
    this.deleteItem = null;
  }
  deleteProgres() {
    this.showDelete = false;
    this.progressService.deleteProgres(this.deleteItem.id).subscribe(data => {
      this.progress = this.progress.filter(
        item => item.id !== this.deleteItem.id
      );
    });
  }
  refreshDashboard() {
    this.dashboardService.getDashboard(this.isSpecial).subscribe(data => {
      this.statistic = this.caculateStatistic(data.meal_statistic);
      this.meal = data.today_meals.meal || {};
      this.meals = data.today_meals;
      this.workouts = data.workouts || { name: '' };
      this.tip = data.tip;
      this.progress = data.latest_posts;
      this.day_number = data.day_number;
      this.week_number = data.week_number;

      if (this.isSpecial) {
        this.meal.sum_nutrients =
          data.today_meals.daily_nutrients_for_recipes || {};
        this.workouts.image_url = this.workouts.name
          ? `http://res.cloudinary.com/ddsadubut/image/upload/workout-day/${this.workouts.name
              .replace('&', ' ')
              .replace(/\s+/g, '_')}.jpg`
          : '';
      }
    });
  }
  startPlan() {
    this.dashboardService.startPlan().subscribe(response => {
      const data: any = response;
      if (data.plan_ready) {
        this.hidePlan = false;
        this.localStorageService.hidePlan = false;
        this.refreshDashboard();
        this.showButtonStartPlan = false;
      } else {
        alert('Start plan fail.');
      }
    });
  }
  closeAlertProgress() {
    this.localStorageService.setHidePopupProgress();
    this.openAlert = false;
  }
}
