import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { SignupService } from '../services/signup.service';
import { SettingService } from '../services/setting.service';

@Component({
    selector: 'app-sign-up-workout',
    templateUrl: './sign-up-workout.component.html',
    styleUrls: ['./sign-up-workout.component.sass']
})
export class SignUpWorkoutComponent implements OnInit {
    experience: string = 'Intermediate';
    workouts: number = 4;
    time: number = 45;
    circuits: boolean = true;

    kneess: boolean = true;
    back: boolean = false;
    shoulders: boolean = true;
    wrists: boolean = false;
    elbows: boolean = false;
    neck: boolean = false;

    constructor(
        private signupService: SignupService,
        private router: Router,
        private _service: NotificationsService,
        private settingService: SettingService
    ) {}

    ngOnInit() {
        const formData = this.signupService.getFormData();
        const { workouts_per_week, time_per_workout, experience_level } = formData;
        this.workouts = workouts_per_week || 4;
        this.time = time_per_workout || 45;
        this.experience = experience_level || 'Intermediate';
        if (!formData.email) {
            this.router.navigateByUrl('/sign-up');
        }
    }
    onSubmit() {
        const workouts_per_week = this.workouts;
        const experience_level = this.experience;
        const time_per_workout = this.time;
        this.signupService
            .register({ workouts_per_week, experience_level, time_per_workout })
            .subscribe(
                data => {
                    this._service.success('Success', 'Successfull create new user!');
                    this.router.navigateByUrl('/dashboard');
                    this.settingService.getSettingInfo().subscribe();
                },
                error => {
                    const errorJson: any = error.error;
                    const message = (errorJson.error && errorJson.error.message) || errorJson.errors[0].message || 'Please check data input.';
                    this._service.error('Error', message, { timeOut: 5000 });
                    this.router.navigateByUrl('/sign-up');
                }
            );
    }
}
