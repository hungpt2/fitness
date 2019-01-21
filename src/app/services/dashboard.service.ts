import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { standarMeal, replaceAPIv2 } from './meals.service';
const url = environment.API_URL;

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}
  getDashboard(isSpecial = false, day_select = null) {
    const apiVersion = isSpecial ? '/v2' : '';
    const query = day_select
      ? '/meal_plan_days/statistic?date=' + day_select
      : '/meal_plan_days/statistic';
    return this.http.get(url + apiVersion + query).pipe(
      map(response => {
        let dashboard: any = response;
        if (dashboard.error) {
          dashboard = { latest_posts: [] };
        }
        const todayMeals = isSpecial
          ? replaceAPIv2(dashboard.meal_plan_day || '')
          : dashboard.meal_plan_day;
        dashboard.today_meals = standarMeal(todayMeals, isSpecial);
        if (dashboard.today_meals) {
          dashboard.today_meals.meal =
            dashboard.today_meals.meal_plan_day.find((item, index) => {
              return (
                !item.done ||
                dashboard.today_meals.meal_plan_day.length === index + 1
              );
            }) || null;
        }
        return dashboard;
      })
    );
  }
  startPlan() {
    const query = '/meal_plans/start_plan';
    const date = new Date();
    const utc_offset = -((date.getTimezoneOffset() / 60) * 3600);
    return this.http.put(url + query, { utc_offset });
  }
}
