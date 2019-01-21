import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ImageCropperModule } from 'ng2-img-cropper';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MealsComponent } from './meals/meals.component';
import { WorkoutsComponent } from './workouts/workouts.component';


import { MealsDetailComponent } from './meals-detail/meals-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { ProgressUploadComponent } from './progress-upload/progress-upload.component';
import { ProgressPostComponent } from './progress-post/progress-post.component';
import { ProgressShareComponent } from './progress-share/progress-share.component';
import { TipsComponent } from './tips/tips.component';
import { TipsDetailsComponent } from './tips-details/tips-details.component';
import { SettingsComponent } from './settings/settings.component';

import { TipsFilterPipe } from './pipes/filter.pipe';
import { MealsService } from './services/meals.service';
import { WorkoutService } from './services/workout.service';
import { TipsService } from './services/tips.service';
import { ProgressService } from './services/progress.service';
import { ShoppingService } from './services/shopping.service';
import { DeleteProgressPipe } from './pipes/delete.pipe';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpNutritionComponent } from './sign-up-nutrition/sign-up-nutrition.component';
import { SignUpWorkoutComponent } from './sign-up-workout/sign-up-workout.component';
import { SignupService } from './services/signup.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { SignUpEmailComponent } from './sign-up-email/sign-up-email.component';
import { RoundPipe } from './pipes/round.pipe';
import { LocalStorageService } from './services/local-storage.service';
import { SettingService } from './services/setting.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AWSService } from './services/aws.service';
import { DashboardService } from './services/dashboard.service';
import { PlayerVimeoComponent } from './player-vimeo/player-vimeo.component';
import { NoopInterceptor } from './_helpers/index';
import { ScrollWorkoutDirective } from './directive/scroll-workout.directive';
import { LbsPipe } from './pipes/lbs.pipe';
import { DashboardWaitingComponent } from './components/dashboard-waiting/dashboard-waiting.component';
import { DashboardAlertCountdownComponent } from './components/dashboard-alert-countdown/dashboard-alert-countdown.component';
import { HeaderSignUpComponent } from './header-sign-up/header-sign-up.component';
import { PickerDateComponent } from './picker-date/picker-date.component';
import { PopupEditProgressComponent } from './popup-edit-progress/popup-edit-progress.component';
import { ProgressAlertComponent } from './components/progress-alert/progress-alert.component';
import { StatisticItemComponent } from './components/statistic-item/statistic-item.component';
import { SignUpMealsSliderComponent } from './sign-up-meals-slider/sign-up-meals-slider.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    MealsComponent,
    WorkoutsComponent,
    MealsDetailComponent,
    ProgressComponent,
    ProgressUploadComponent,
    ProgressPostComponent,
    ProgressShareComponent,
    TipsComponent,
    TipsDetailsComponent,
    SettingsComponent,
    TipsFilterPipe,
    DeleteProgressPipe,
    ShoppingListComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    SignUpNutritionComponent,
    SignUpWorkoutComponent,
    SignUpEmailComponent,
    RoundPipe,
    PlayerVimeoComponent,
    ScrollWorkoutDirective,
    LbsPipe,
    DashboardWaitingComponent,
    DashboardAlertCountdownComponent,
    HeaderSignUpComponent,
    PickerDateComponent,
    PopupEditProgressComponent,
    ProgressAlertComponent,
    StatisticItemComponent,
    SignUpMealsSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    ImageCropperModule,
    SlickCarouselModule
  ],
  providers: [
    TipsFilterPipe,
    MealsService,
    WorkoutService,
    TipsService,
    ProgressService,
    ShoppingService,
    DeleteProgressPipe,
    SignupService,
    AuthGuard,
    AuthenticationService,
    LocalStorageService,
    SettingService,
    AWSService,
    DashboardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
