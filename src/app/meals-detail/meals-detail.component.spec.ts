import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsDetailComponent } from './meals-detail.component';

describe('MealsDetailComponent', () => {
  let component: MealsDetailComponent;
  let fixture: ComponentFixture<MealsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
