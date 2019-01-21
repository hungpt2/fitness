import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpEmailComponent } from './sign-up-email.component';

describe('SignUpEmailComponent', () => {
  let component: SignUpEmailComponent;
  let fixture: ComponentFixture<SignUpEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
