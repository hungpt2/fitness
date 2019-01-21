import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpNutritionComponent } from './sign-up-nutrition.component';

describe('SignUpNutritionComponent', () => {
  let component: SignUpNutritionComponent;
  let fixture: ComponentFixture<SignUpNutritionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpNutritionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpNutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
