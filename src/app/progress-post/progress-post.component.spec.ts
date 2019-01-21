import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPostComponent } from './progress-post.component';

describe('ProgressPostComponent', () => {
  let component: ProgressPostComponent;
  let fixture: ComponentFixture<ProgressPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
