import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalStorageService } from '../services/local-storage.service';

const url = environment.API_URL;
@Injectable()
export class ShoppingService {
  private mealPlanID = null;
  apiVersion = '';
  isSpecial = false;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}
  getSpecial() {
    this.isSpecial = this.localStorageService.getIsSpecial();
    if (this.isSpecial) {
      this.apiVersion = '/v2';
    }
  }
  getShoppings(week = 1) {
    if (!this.mealPlanID) return [];
    this.getSpecial();
    return this.http
      .get(
        url +
          `${this.apiVersion}/meal_plans/${
            this.mealPlanID
          }/shopping_list?week_no=` +
          week
      )
      .pipe(
        map((response: any) => {
          const shoppingList = this.isSpecial
            ? response.shopping_list
            : groupFood(response);
          const { proteins, carbohydrates, vegetables, fats } = shoppingList;
          return [
            { title: 'PROTEIN', data: proteins },
            { title: 'CARBOHYDRATES', data: carbohydrates },
            { title: 'FRUIT & VEGETABLES', data: vegetables },
            { title: 'FATS', data: fats }
          ];
        })
      );
  }
  markDone(data) {
    return this.http.post(
      url +
        `${this.apiVersion}/meal_plans/${this.mealPlanID}/mark_shopping_done`,
      data
    );
  }
  setMealPlan(id) {
    this.mealPlanID = id;
  }
  sendMail(week) {
    return this.http.post(
      url + `${this.apiVersion}/meal_plans/shopping_list_email`,
      {
        id: this.mealPlanID,
        week_no: week
      }
    );
  }
}
function groupFood(foods) {
  const foodGrouped = {
    proteins: [],
    carbohydrates: [],
    vegetables: [],
    fats: []
  };
  foods.map(item => {
    item.status = (item.meta && item.meta.done) || false;
    item.protein_source && foodGrouped.proteins.push(item);
    item.carb_sources && foodGrouped.carbohydrates.push(item);
    item.fruit_veg_swap && foodGrouped.vegetables.push(item);
    item.fat_sources && foodGrouped.fats.push(item);
  });
  return foodGrouped;
}
