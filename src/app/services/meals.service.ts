import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
const url = environment.API_URL;

@Injectable()
export class MealsService {
  isSpecial = false;
  apiVersion = '';
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
  getMeals(week) {
    this.getSpecial();
    return this.http
      .get(url + this.apiVersion + '/meal_plans/meal_plan_days?week_no=' + week)
      .pipe(
        map(response => {
          const mealsOld: any = response;
          const meals: any = this.isSpecial ? replaceAPIv2(mealsOld) : mealsOld;
          const meal_plan_days = meals.meal_plan_days.map(meal => {
            return standarMeal(meal, this.isSpecial);
          });
          return { ...meals, meal_plan_days };
        })
      );
  }
  getMeal(id: number) {
    this.getSpecial();
    return this.http.get(url + '/meal_plan_days/' + id).pipe(
      map(response => {
        const mealOld: any = response;
        const meal: any = this.isSpecial ? replaceAPIv2(mealOld) : mealOld;
        return {
          ...meal,
          meal_plan_day: standarMeal(meal.meal_plan_day, this.isSpecial)
        };
      })
    );
  }
  getSwapFoodItem(foodId) {
    let stringRequest = '/meal_food_items/available_swap?food_item_id=';
    if (this.isSpecial) {
      stringRequest =
        this.apiVersion +
        '/meal_recipes/available_swap?meal_plan_day_recipe_id=';
    }
    return this.http.get(url + stringRequest + foodId).pipe(
      map(response => {
        const itemsOld: any = response;
        const items: any = this.isSpecial
          ? JSON.parse(
              JSON.stringify(itemsOld).replace(
                /meal_recipes/g,
                'meal_food_items'
              )
            )
          : itemsOld;
        return items;
      })
    );
  }
  swapFoodItem(foodId, newFoodId) {
    const urlRequest = this.isSpecial
      ? '/meal_plans/swap_meal_recipes'
      : '/meal_plans/swap_food_items';
    const body = this.isSpecial
      ? {
          meal_plan_day_recipe_id: foodId,
          new_meal_recipe_id: newFoodId
        }
      : {
          food_item_id: foodId,
          new_meal_food_item_id: newFoodId
        };
    return this.http.post(url + this.apiVersion + urlRequest, body).pipe(
      map(response => {
        const mealOld: any = response;
        const meal: any = this.isSpecial ? replaceAPIv2(mealOld) : mealOld;
        return meal;
      })
    );
  }
  setDoneMeal(id, meal_type) {
    return this.http
      .put(url + `${this.apiVersion}/meal_plan_days/${id}/toggle_meal_status`, {
        meal_type
      })
      .pipe(
        map(response => {
          const items: any = response;
          return items;
        })
      );
  }
  sendMail(id) {
    return this.http.post(url + '/meal_plans/send_email', {
      id
    });
  }
  sendMailDay(id) {
    return this.http.post(url + '/meal_plan_days/send_email', {
      id
    });
  }
}
export function replaceAPIv2(input) {
  return JSON.parse(
    JSON.stringify(input)
      .replace(
        /meal_plan_day_meal_food_items/g,
        'meal_plan_day_meal_food_items_replaced'
      )
      .replace(/meal_plan_day_meal_recipes/g, 'meal_plan_day_meal_food_items')
      .replace(/meal_recipe/g, 'meal_food_item')
  );
}
export function getTitleIngregient(item: any, metric = 1) {
  const { custom_qty, meal_food_item } = item;
  if (metric === 2) {
    let quanty = custom_qty;
    let unitMeasure = 'oz';
    if (meal_food_item.unit_of_measure === 'g') {
      quanty = Number((custom_qty * 0.0352739619).toFixed(1));
    } else {
      unitMeasure = meal_food_item.unit_of_measure;
      if (unitMeasure) {
        const unit: any = (unitMeasure.match(/\d+/g)[0] || '').replace('g', '');
        const ozValue = Number((unit * 0.0352739619).toFixed(1));
        unitMeasure = unitMeasure.replace(/\d+g/g, `${ozValue}oz`);
      }
    }
    return `${(unitMeasure && quanty) || ''}${unitMeasure || ''} ${
      meal_food_item.name
    }`;
  }
  return `${(meal_food_item.unit_of_measure && custom_qty) ||
    ''}${meal_food_item.unit_of_measure || ''} ${meal_food_item.name}`;
}

function sumNutrients(array: any, isSpecial = false) {
  if (isSpecial) {
    return array.reduce(
      (sum, value) => {
        return {
          carb_sum: sum.carb_sum + value.meal_food_item.carb,
          protein_sum: sum.protein_sum + value.meal_food_item.protein,
          fat_sum: sum.fat_sum + value.meal_food_item.fat,
          calories_sum: sum.calories_sum + value.meal_food_item.calories
        };
      },
      { carb_sum: 0, protein_sum: 0, fat_sum: 0, calories_sum: 0 }
    );
  }
  return array.reduce(
    (sum, value) => {
      return {
        carb_sum:
          sum.carb_sum +
          (value.meal_food_item.b_carb / value.meal_food_item.base_value) *
            value.custom_qty,
        protein_sum:
          sum.protein_sum +
          (value.meal_food_item.b_protein / value.meal_food_item.base_value) *
            value.custom_qty,
        fat_sum:
          sum.fat_sum +
          (value.meal_food_item.b_fat / value.meal_food_item.base_value) *
            value.custom_qty,
        calories_sum:
          sum.calories_sum +
          (value.meal_food_item.b_calories / value.meal_food_item.base_value) *
            value.custom_qty
      };
    },
    { carb_sum: 0, protein_sum: 0, fat_sum: 0, calories_sum: 0 }
  );
}

export function getImageOfMeals(array = [], isSpecial = false) {
  const proImg =
    'https://lsf-web.s3.amazonaws.com/uploads/meal_food_item/image/69/Whey_Protein.png';
  const carbImg =
    'https://lsf-web.s3.amazonaws.com/uploads/meal_food_item/image/13/Brown_Rice_Cakes.jpg';
  if (isSpecial) {
    return (
      (array[0].meal_food_item && array[0].meal_food_item.image_url) || carbImg
    );
  }
  let meal = array.find(item => item.meal_food_item.protein_source);
  if (meal) {
    return meal.meal_food_item.image_url || proImg;
  }
  meal = array.find(item => item.meal_food_item.carb_sources);
  if (meal) {
    return meal.meal_food_item.image_url || carbImg;
  }

  return carbImg;
}

export function getnameFull(array = []) {
  if (!array.length) return null;
  return array[0].meal_food_item.name || '';
}

function getStatusDone(array: any) {
  const itemNotDone = array.find(item => item.done !== true);
  return itemNotDone ? false : true;
}
export function standarMeal(meal, isSpecial = false) {
  const new_meal_plan_day = {};
  meal &&
    meal.meal_plan_day_meal_food_items.map(item => {
      const { id, custom_qty, user_can_swap, name } = item;
      if (new_meal_plan_day[item.meal_type]) {
        new_meal_plan_day[item.meal_type].push({ ...item });
      } else {
        new_meal_plan_day[item.meal_type] = [{ ...item }];
      }
    });
  const meal_plan_day = [];
  Object.keys(new_meal_plan_day).forEach(function(key, index) {
    const items = new_meal_plan_day[key];
    meal_plan_day.push({
      items,
      sum_nutrients: sumNutrients(items, isSpecial),
      image_url: getImageOfMeals(items, isSpecial),
      meal_type: key,
      done: getStatusDone(items),
      name: `Meal ${index + 1}`,
      name_full: getnameFull(items) || `Meal ${index + 1}`,
      isSpecial
    });
  });
  if (meal) {
    meal.meal_plan_day = meal_plan_day;
    if (isSpecial) {
      meal.daily_nutrients = sumNutrients(
        meal.meal_plan_day_meal_food_items,
        isSpecial
      );
    }
  } else {
    meal = { meal_plan_day };
  }
  return meal;
}
