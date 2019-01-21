import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

import { Meal } from '../classes/meal';

import {
  MealsService,
  getTitleIngregient,
  getImageOfMeals
} from '../services/meals.service';
import { printPage } from '../_helpers/printPage';
import { SettingService } from '../services/setting.service';
import { LocalStorageService } from '../services/local-storage.service';
import { currentPassDate } from '../_helpers/timer';

@Component({
  selector: 'app-meals-detail',
  templateUrl: './meals-detail.component.html',
  styleUrls: ['./meals-detail.component.sass']
})
export class MealsDetailComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.simple_height();
  }

  @Input() meal: any = {};

  ls_have: boolean;
  selectday: number;
  simpleHeight: string;
  foodHeight: string;
  simpleView: boolean;
  foodPop: boolean;
  select: string;
  selectOption: any;
  selectIngredients: any;
  containerHeights: any;
  qeualHeights: any;

  swapOptions: any = [];
  unit_system = null;
  isSpecial = false;
  selectIngredientsSpecial: any;
  hidePlanStart = false;
  isExpried: Boolean = false;
  disableEdit: Boolean = false;
  numberDirectionOpen = 0;
  oldHeight = null;
  constructor(
    private mealsService: MealsService,
    private route: ActivatedRoute,
    private location: Location,
    private _service: NotificationsService,
    private settingService: SettingService,
    private localStorageService: LocalStorageService
  ) {
    this.meal = {};
  }

  selectDay(val: number = 0, val2: number) {
    this.selectday = val + val2;
    if (this.selectday > 2) {
      this.ls_have = true;
    } else {
      this.ls_have = false;
    }
    return this.selectday;
  }

  simple_height() {
    if (window.innerWidth > 768) {
      this.simpleHeight = window.innerHeight * 0.8 + 'px';
    } else {
      this.simpleHeight = window.innerHeight + 'px';
    }
    this.foodHeight = window.innerHeight * 0.8 + 'px';
  }

  chooseOption(val) {
    this.select = val;
    this.selectOption = val.id;
    return this.select;
  }

  chooseIngredient(item, isSpecial = false, meal_item) {
    if (this.isExpried) {
      return null;
    }
    this.isSpecial = isSpecial;
    this.mealsService.getSwapFoodItem(item.id).subscribe(items => {
      this.swapOptions = items.meal_food_items;
      this.foodPop = true;
      this.selectOption = '';
    });
    this.selectIngredients = item;
    if (meal_item) {
      this.selectIngredientsSpecial = meal_item;
    }
  }

  confirmFun() {
    if (!this.selectOption) {
      this.foodPop = false;
      return;
    }
    this.mealsService
      .swapFoodItem(this.selectIngredients.id, this.selectOption)
      .subscribe(
        meal => {
          this.selectIngredients.meal_food_item =
            meal.meal_plan_day_meal_food_item.meal_food_item;
          this.selectIngredients.custom_qty =
            meal.meal_plan_day_meal_food_item.custom_qty;
          this.foodPop = false;
          if (this.isSpecial) {
            this.selectIngredientsSpecial.image_url =
              this.selectIngredients.meal_food_item.image_url || '';
            this.selectIngredientsSpecial.name_full =
              this.selectIngredients.meal_food_item.name || '';
          }
        },
        error => {
          const message = error.error.error.message;
          this._service.error(
            'Error',
            message || 'Error when submit change food'
          );
        }
      );
  }

  equalHeight(val) {
    this.containerHeights = document.getElementsByClassName('meals-details');
    if (window.innerWidth > 992) {
      if (val) {
        if (this.numberDirectionOpen === 1 && !this.oldHeight) {
          this.oldHeight = this.qeualHeights;
        }
        this.qeualHeights = 'auto';
        return this.qeualHeights;
      } else {
        if (this.numberDirectionOpen === 0 && this.oldHeight) {
          const height = this.oldHeight;
          return height + 'px';
        }
        const arrayHeight = Array.from(this.containerHeights).map(item => {
          const itemObject: any = item;
          return itemObject.clientHeight;
        });
        this.qeualHeights = Math.max(...arrayHeight);
        return this.qeualHeights + 'px';
      }
    } else {
      this.qeualHeights = 'auto';
      return this.qeualHeights;
    }
  }

  ngOnInit() {
    this.hidePlanStart = this.localStorageService.getHidePlanStart();
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.mealsService.getMeal(+params.get('id'))
        )
      )
      .subscribe((meal: any) => {
        this.meal = meal.meal_plan_day;
      });
    this.simple_height();
    this.settingService.currentUser.subscribe(data => {
      this.unit_system = data.unit_system;
      this.isExpried = data.total_week < data.current_week;
      this.disableEdit =
        this.isExpried || !currentPassDate(data.shred_challenge_start_at);
    });
  }

  goBack() {
    this.location.back();
  }
  submitDone(id, meal_type) {
    if (this.disableEdit) {
      return null;
    }
    this.mealsService.setDoneMeal(id, meal_type).subscribe(data => {
      const mealUpdate = this.meal.meal_plan_day.find(
        item => item.meal_type === meal_type
      );
      if (mealUpdate) {
        mealUpdate.done = !mealUpdate.done;
      }
    });
  }
  printElem() {
    printPage();
  }
  sendMail() {
    this.mealsService.sendMailDay(this.meal.id).subscribe(
      data => {
        this._service.success('Success', 'Successfull send to your email!');
      },
      error => {
        this._service.error('Error', 'Can not send to your email');
      }
    );
  }
  updateImageMeal(status, meal) {
    if (status) {
      meal.image_url = getImageOfMeals(meal.items);
    }
  }
  titleIngredient(item) {
    return getTitleIngregient(item, this.unit_system);
  }
  processLayoutDirection(isOpenDiections) {
    this.numberDirectionOpen = isOpenDiections
      ? this.numberDirectionOpen + 1
      : this.numberDirectionOpen - 1;
  }
}
