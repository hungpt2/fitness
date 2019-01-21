import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { WorkoutService } from '../services/workout.service';
import { NotificationsService } from 'angular2-notifications';
import { printPage } from '../_helpers/printPage';
import { SettingService } from '../services/setting.service';
import { LocalStorageService } from '../services/local-storage.service';
import { currentPassDate } from '../_helpers/timer';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.sass']
})
export class WorkoutsComponent implements OnInit {
  videoPop = false;
  totalWeek: any = 4;
  selectedWeek: number;
  showDays: Boolean = true;
  simpleHeight: string;
  simpleView: boolean;
  videoHeight: string;
  workouts: any = {};
  selectedDay: any = 0;
  workoutsWeek: any = [];
  video: string;
  isSpecial = false;
  hidePlanStart = false;
  disableEdit: Boolean = false;
  @HostListener('window:resize')
  onResize(): any {
    this.showSelection();
    this.simple_height();
  }

  constructor(
    private workoutService: WorkoutService,
    private route: ActivatedRoute,
    private location: Location,
    private _service: NotificationsService,
    private localStorageService: LocalStorageService,
    private settingService: SettingService
  ) {}

  showSelection() {
    if (window.innerWidth < 768) {
      this.showDays = false;
    } else {
      this.showDays = true;
    }
  }

  simple_height() {
    if (window.innerWidth > 768) {
      this.simpleHeight = window.innerHeight * 0.8 + 'px';
    } else {
      this.simpleHeight = window.innerHeight + 'px';
    }
  }
  ngOnInit() {
    this.isSpecial = this.localStorageService.getIsSpecial();
    this.hidePlanStart = this.localStorageService.getHidePlanStart();
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.selectedWeek = +params.get('id');
          this.selectedDay = +params.get('day');
          if (!this.selectedDay) {
            this.selectedDay = 0;
          } else {
            this.selectedDay -= 1;
          }
          return this.workoutService.getWorkouts(+params.get('id'));
        })
      )
      .subscribe(workouts => {
        this.workouts = workouts[this.selectedDay];
        this.workoutsWeek = workouts;
      });

    this.simple_height();
    this.settingService.currentUser.subscribe(data => {
      this.totalWeek = data.total_week;
      this.disableEdit =
        data.total_week < data.current_week ||
        !currentPassDate(data.shred_challenge_start_at);
    });
  }
  getResource(type, value) {
    value = encodeURIComponent(value.toUpperCase());
    if (type === 'images') {
      return (
        'http://lsf-web.s3.amazonaws.com/excercises-images/' + value + '.png'
      );
    } else {
      return (
        'http://lsf-web.s3.amazonaws.com/excercises-videos/' + value + '.m4v'
      );
    }
  }
  setDoneExcercise(id, workout) {
    if (this.disableEdit) {
      return null;
    }
    this.workoutService.setDoneExercise(id).subscribe(
      data => {
        workout.done = !workout.done;
      },
      error => {
        const message = error.error.errors[0].message;
        this._service.error('Error', message || 'Fetch data fail');
      }
    );
  }
  onSelectDay(day) {
    this.selectedDay = day;
    this.location.replaceState(
      `/workouts/${this.selectedWeek}/${this.selectedDay + 1}`
    );
    this.workouts = this.workoutsWeek[day];
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
  exerciseSelected(workout) {
    this.videoPop = true;
    this.video = workout.exercise.video;
  }
  onCLoseVideo(event) {
    this.videoPop = event;
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
    this.workoutService
      .sendMail(this.workouts.id)
      .subscribe(
        data =>
          this._service.success('Success', 'Successfull send to your email!'),
        error => this._service.error('Error', 'Can not send to your email')
      );
  }
  scrollChange(position, workout) {
    const newName = workout.items[position].exercise.name;
    workout.name = newName;
  }
}
