import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressUploadComponent } from './progress-upload.component';

describe('ProgressUploadComponent', () => {
  let component: ProgressUploadComponent;
  let fixture: ComponentFixture<ProgressUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
