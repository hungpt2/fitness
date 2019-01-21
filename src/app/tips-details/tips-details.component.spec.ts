import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsDetailsComponent } from './tips-details.component';

describe('TipsDetailsComponent', () => {
  let component: TipsDetailsComponent;
  let fixture: ComponentFixture<TipsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
