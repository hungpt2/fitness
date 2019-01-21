import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressShareComponent } from './progress-share.component';

describe('ProgressShareComponent', () => {
  let component: ProgressShareComponent;
  let fixture: ComponentFixture<ProgressShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
