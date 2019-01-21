import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { ShoppingService } from '../services/shopping.service';
import { SettingService } from '../services/setting.service';
import { printPage } from '../_helpers/printPage';
import { MealsService, getTitleIngregient } from '../services/meals.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Meal } from '../classes/meal';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.sass']
})
export class ShoppingListComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.simple_height();
  }

  shoppings: any = [];
  simpleHeight: string;
  simpleView: boolean = false;
  selectedWeek = 1;
  totalWeek = 4;
  userInfo: any = null;
  unit_system = null;
  isSpecial = false;
  meals: Meal[];
  mealsPlanWeek: any = {};
  isBooty = false;
  constructor(
    private route: ActivatedRoute,
    private shoppingService: ShoppingService,
    private _service: NotificationsService,
    private settingService: SettingService,
    private localStorageService: LocalStorageService,
    private mealsService: MealsService
  ) { }

  simple_height() {
    if (window.innerWidth > 768) {
      this.simpleHeight = window.innerHeight * 0.8 + 'px';
    } else {
      this.simpleHeight = window.innerHeight + 'px';
    }
  }

  ngOnInit() {
    this.isSpecial = this.localStorageService.getIsSpecial();
    this.isBooty = this.localStorageService.isBooty;
    this.settingService.currentUser.subscribe(data => {
      this.userInfo = data;
      this.unit_system = this.userInfo.unit_system;
      this.totalWeek = data.total_week;
      this.initData();
    });
  }
  initData() {
    if (this.isSpecial && !this.isBooty) {
      this.getMeals();
    } else {
      this.shoppingService.setMealPlan(this.userInfo.meal_plan_id);
      this.getDataShopping();
    }
  }
  getMeals() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.selectedWeek = +params.get('id');
          return this.mealsService.getMeals(+params.get('id'));
        })
      )
      .subscribe((meals: any) => {
        this.mealsPlanWeek = meals.meal_plan_week;
        this.meals = meals.meal_plan_days;
        this.totalWeek = meals.meal_plan.week_count;
      });

    this.simple_height();
  }
  getDataShopping() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.selectedWeek = +params.get('id');
          if (this.selectedWeek === 0) {
            this.selectedWeek = 1;
          }
          return this.shoppingService.getShoppings(this.selectedWeek);
        })
      )
      .subscribe(data => {
        this.shoppings = data;
      });
    this.simple_height();
  }
  checkMark(item) {
    const { id, status } = item;
    const tmpStatusSubmit = status === 'checked' ? 'unchecked' : status === 'unchecked' ? 'checked' : status === true ? false : true;
    let statusSubmit: any;
    if (typeof (tmpStatusSubmit) === 'boolean') {
      statusSubmit = tmpStatusSubmit ? 'checked' : 'unchecked';
    } else {
      statusSubmit = tmpStatusSubmit;
    }
    const formData: any = {
      id: this.userInfo.meal_plan_id,
      meal_food_item_id: id,
      week_no: this.selectedWeek,
      status: statusSubmit
    };
    if (this.isSpecial) {
      formData.category = item.category;
      formData.ingredient_name = item.name;
    }
    this.shoppingService.markDone(formData).subscribe(
      data => {
        item.status = statusSubmit;
      },
      error => {
        this._service.error('Error to check mark Shop Item');
      }
    );
  }
  nextWeek(value: number) {
    if (this.selectedWeek + value === this.totalWeek + 1) {
      return 1;
    } else if (this.selectedWeek + value === 0) {
      return this.totalWeek;
    } else {
      return this.selectedWeek + value;
    }
  }
  printElem(isDirect = false) {
    if (isDirect) {
      setTimeout(() => {
        printPage();
      }, 200);
    } else {
      printPage();
    }
  }
  sendMail() {
    this.shoppingService.sendMail(this.selectedWeek).subscribe(
      data => {
        this._service.success('Success', 'Successfull send to your email!');
      },
      error => {
        this._service.error('Error', 'Can not send to your email');
      }
    );
  }
  titleIngredient(item) {
    const { meta, unit_of_measure, name } = item;
    const itemNew = {
      custom_qty: meta.qty_sum,
      meal_food_item: { unit_of_measure, name }
    };
    return getTitleIngregient(itemNew, this.unit_system);
  }
  titleIngredientSpecial(item) {
    return getTitleIngregient(item, this.unit_system);
  }
}
