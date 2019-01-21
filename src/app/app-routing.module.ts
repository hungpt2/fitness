import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MealsComponent } from './meals/meals.component';
import { MealsDetailComponent } from './meals-detail/meals-detail.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { ProgressComponent } from './progress/progress.component';
import { ProgressUploadComponent } from './progress-upload/progress-upload.component';
import { ProgressPostComponent } from './progress-post/progress-post.component';
import { ProgressShareComponent } from './progress-share/progress-share.component';
import { TipsComponent } from './tips/tips.component';
import { TipsDetailsComponent } from './tips-details/tips-details.component';
import { SettingsComponent } from './settings/settings.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignUpEmailComponent } from './sign-up-email/sign-up-email.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpNutritionComponent } from './sign-up-nutrition/sign-up-nutrition.component';
import { SignUpWorkoutComponent } from './sign-up-workout/sign-up-workout.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'meals/:id', component: MealsComponent, canActivate: [AuthGuard] },
  { path: 'meals-detail/:id', component: MealsDetailComponent, canActivate: [AuthGuard] },
  { path: 'workouts/:id', component: WorkoutsComponent, canActivate: [AuthGuard] },
  { path: 'workouts/:id/:day', component: WorkoutsComponent, canActivate: [AuthGuard] },
  { path: 'progress', component: ProgressComponent, canActivate: [AuthGuard] },
  { path: 'progress-upload', component: ProgressUploadComponent, canActivate: [AuthGuard] },
  { path: 'progress-upload/:id', component: ProgressUploadComponent, canActivate: [AuthGuard] },
  { path: 'progress-post', component: ProgressPostComponent, canActivate: [AuthGuard] },
  { path: 'progress-post/:id', component: ProgressPostComponent, canActivate: [AuthGuard] },
  { path: 'progress-share', component: ProgressShareComponent, canActivate: [AuthGuard] },
  { path: 'progress-share/:id', component: ProgressShareComponent, canActivate: [AuthGuard] },
  { path: 'tips', component: TipsComponent, canActivate: [AuthGuard] },
  { path: 'tips-detail/:id', component: TipsDetailsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'shopping', component: ShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'shopping/:id', component: ShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sign-up-email', component: SignUpEmailComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-nutrition', component: SignUpNutritionComponent },
  { path: 'sign-up-workout', component: SignUpWorkoutComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
