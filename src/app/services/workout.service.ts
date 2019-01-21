import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Workout } from '../classes/workout';
import { WORKOUTS } from '../classes/workouts';
import { environment } from '../../environments/environment';
const url = environment.API_URL;
@Injectable()
export class WorkoutService {
  constructor(private http: HttpClient) {}
  getWorkouts(week) {
    return this.http.get(url + '/exercises/week_exercises?week=' + week).pipe(
      map(response => {
        const workouts: any = response;
        const new_workouts = workouts.map(item => {
          item.exercises_grouped = groupExcercises(item);
          return item;
        });
        return new_workouts;
      })
    );
  }
  setDoneExercise(id) {
    return this.http.put(url + `/exercises/${id}/toggle_status`, { id }).pipe(
      map(response => {
        return id;
      })
    );
  }
  sendMail(id) {
    return this.http.post(url + '/exercises/send_email', {
      id
    });
  }
}
function groupExcercises(workout: any) {
  const exercises_grouped_dict = {};
  workout.exercises.map(item => {
    const order_no = item.order_no || 0;
    item.exercise.video =
      item.exercise.video &&
      item.exercise.video.replace('https://vimeo.com/', '');
    if (exercises_grouped_dict[order_no]) {
      exercises_grouped_dict[order_no].push(item);
    } else {
      exercises_grouped_dict[order_no] = [item];
    }
  });
  const exercises_grouped = [];
  Object.keys(exercises_grouped_dict).forEach(function(key) {
    const items = exercises_grouped_dict[key];
    const title =
      items.length > 1 ? (items.length < 10 ? 'SUPERSET' : 'CIRCUIT') : '';
    const name = items.length && items[0].exercise.name;
    exercises_grouped.push({
      items,
      title,
      name
    });
  });
  return exercises_grouped;
}
