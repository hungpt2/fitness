import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sign-up-meals-slider',
  templateUrl: './sign-up-meals-slider.component.html',
  styleUrls: ['./sign-up-meals-slider.component.sass']
})
export class SignUpMealsSliderComponent implements OnInit {
  @Input() mealsPlan = [];
  @Output() public selectMealPlan = new EventEmitter<Number>();
  mealPlanIndex = 0;
  constructor() {}

  ngOnInit() {
    if (this.mealsPlan.length) {
      const selectMeal = this.mealsPlan[this.mealPlanIndex];
      this.selectMealPlan.emit(selectMeal.id);
    }
  }

  slides = [
    { img: 'assets/img/meal-plan-lose-5.png' },
    { img: 'assets/img/meal-plan-lose-1.png' },
    { img: 'assets/img/meal-plan-base.png' }
  ];
  slideConfig = {
    slidesToScroll: 1,
    slidesToShow: 1,
    centerMode: true,
    arrows: true,
    dots: true
    // centerPadding: '100px',
    // appendDots: '.slick__arrow'
  };

  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  afterChange(e) {
    this.mealPlanIndex = e.currentSlide;
    const id = this.mealsPlan[this.mealPlanIndex].id;
    this.selectMealPlan.emit(id);
  }
}
