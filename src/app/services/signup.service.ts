import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from '../../environments/environment';
import { Signup } from '../classes/signup';
const url = environment.API_URL;

export const SKU_PLAN = {
  '4-week-training-plan': 'training',
  '8-week-training-plan': 'training',
  '12-week-training-plan': 'training',
  '4-week-meal-plan': 'meals',
  '8-week-meal-plan': 'meals',
  '12-week-meal-plan': 'meals'
};

@Injectable()
export class SignupService {
  private _formData: Signup;
  skuInfo: any = {};
  listSku: any = [];
  constructor(private http: HttpClient) {
    this._formData = new Signup();
  }
  setFormData(object) {
    this._formData = {
      ...this._formData,
      ...object
    };
  }
  getFormData() {
    return this._formData;
  }
  register(object = null) {
    if (object) {
      this.setFormData(object);
    }
    const urlRegister = this._formData.dietary_preference
      ? '/v2/users'
      : '/users';
    const { day, month, year } = this._formData;
    if (year) {
      this._formData = {
        ...this._formData,
        date_of_birth: `${day}/${month}/${year}`
      };
    }
    const formDataSubmit = { ...this._formData };
    if (formDataSubmit.unit_system === '2') {
      formDataSubmit.goal_weight = convertLbstoKg(formDataSubmit.goal_weight);
      formDataSubmit.weight = convertLbstoKg(formDataSubmit.weight);
    }
    const date = new Date();
    formDataSubmit.utc_offset = -((date.getTimezoneOffset() / 60) * 3600);
    const formData = { user: formDataSubmit };
    return this.http.post(url + urlRegister, formData).pipe(
      map(response => {
        const user: any = response;
        if (user && user.meta) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._formData = new Signup();
        }
        return user;
      })
    );
  }
  validateEmail(email) {
    const urlAuth =
      'https://www.laurensimpsonfitness.com/lsf/customer/orders?username=' +
      email;
    return this.http.get(urlAuth).pipe(
      map(response => {
        const user: any = response;
        if (user.userData) {
          const orderData = user.orderData;
          const found = orderData.find(item => {
            if (item.sku && item.sku.length > 1) {
              return item.sku.find(
                item => item === '8-week-lsf-100k-fit-challenge'
              );
            } else {
              return item.sku[0] === '8-week-lsf-100k-fit-challenge';
            }
          });
          if (found) {
            return '8-week-lsf-100k-fit-challenge';
          } else {
            const union = _.intersection(this.listSku, orderData[0].sku);
            if (union.length) {
              return union[0];
            }

            return orderData[0].sku[0] || null;
          }
        }
        return null;
      })
    );
  }
  getUser() {
    return {
      email: this._formData.email,
      password: this._formData.password
    };
  }
  resetSignup() {
    this._formData = new Signup();
  }
  getFoodPreferences(data) {
    let paramater = '';
    let isVegan = false;
    data.map((item, index) => {
      if (item === 'vegan') {
        isVegan = true;
      }
      paramater += 'dietary_requirements%5B%5D=' + item;
      if (index !== data.length - 1) {
        paramater += '&';
      }
    });
    return this.http
      .get(url + '/meal_food_items/food_preferences?' + paramater)
      .pipe(
        map(response => {
          const foods: any = response;
          return groupFood(foods, isVegan);
        })
      );
  }
  getPlanType() {
    const { sku } = this._formData;
    return SKU_PLAN[sku];
  }

  getInfoSku(sku) {
    return this.http.get(url + '/skus/check_sku?name=' + sku).pipe(
      map(response => {
        this.skuInfo = response;
        return response;
      })
    );
  }

  getListSku() {
    return this.http.get(url + '/skus').pipe(
      map((response: any) => {
        this.listSku = response.skus.map(item => item.name);
        return this.listSku;
      })
    );
  }
}
function groupFood(foods, bool) {
  const foodGrouped = {
    proteins: [],
    carbs: [],
    fruits: [],
    fats: []
  };
  foods.meal_food_items.map(item => {
    if (bool) {
      (item.protein_source || item.vegetarian_protein_swap) &&
        foodGrouped.proteins.push(item);
    } else {
      item.protein_source && foodGrouped.proteins.push(item);
    }
    item.carb_sources && foodGrouped.carbs.push(item);
    item.fruit_veg_swap && foodGrouped.fruits.push(item);
    item.fat_sources && foodGrouped.fats.push(item);
  });
  return foodGrouped;
}
function convertLbstoKg(params: number) {
  return Math.round(params / 2.2046226218488);
}
