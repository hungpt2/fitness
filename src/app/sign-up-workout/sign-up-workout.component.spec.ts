import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpWorkoutComponent } from './sign-up-workout.component';

describe('SignUpWorkoutComponent', () => {
  let component: SignUpWorkoutComponent;
  let fixture: ComponentFixture<SignUpWorkoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpWorkoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
