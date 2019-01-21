import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { switchMap } from 'rxjs/operators';

import { Meal } from '../classes/meal';
import { MealsService, getTitleIngregient } from '../services/meals.service';
import { printPage } from '../_helpers/printPage';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.sass']
})
export class MealsComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.simple_height();
  }

  meals: Meal[];
  selectedMeal: Meal;
  sipmleView: boolean = false;
  simpleHeight: string;
  mealsPlanWeek: any = {};
  totalWeek: number = 4;
  selectedWeek: number;
  unit_system = null;
  constructor(
    private mealsService: MealsService,
    private route: ActivatedRoute,
    private location: Location,
    private _service: NotificationsService,
    private settingService: SettingService
  ) {}

  onSelect(meal: Meal) {
    this.selectedMeal = meal;
  }

  simple_height() {
    if (window.innerWidth > 768) {
      this.simpleHeight = window.innerHeight * 0.8 + 'px';
    } else {
      this.simpleHeight = window.innerHeight + 'px';
    }
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

  ngOnInit() {
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
    this.settingService.currentUser.subscribe(
      data => (this.unit_system = data.unit_system)
    );
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
    this.mealsService.sendMail(this.mealsPlanWeek.id).subscribe(
      data => {
        this._service.success('Success', 'Successfull send to your email!');
      },
      error => {
        this._service.error('Error', 'Can not send to your email');
      }
    );
  }
  titleIngredient(item) {
    return getTitleIngregient(item, this.unit_system);
  }
}
