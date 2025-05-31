import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathCaptchaComponent } from './math-captcha.component';

describe('MathCaptchaComponent', () => {
  let component: MathCaptchaComponent;
  let fixture: ComponentFixture<MathCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathCaptchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
