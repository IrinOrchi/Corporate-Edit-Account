import { Component, OnInit, signal, computed, Input } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputFieldComponent } from '../input-field/input-field.component';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './math-captcha.component.html',
  styleUrls: ['./math-captcha.component.scss']
})
export class MathCaptchaComponent implements OnInit {
  @Input() employeeForm!: FormGroup;

  operand1 = signal(this.randomNumber(5, 10)); 
  operand2 = signal(this.randomNumber(1, 5)); 
  operator = signal(this.randomOperator());

  expressionDisplay = computed(() => {
    const operatorSymbol = this.operator() === '/' ? '÷' : this.operator();
    return `${this.operand1()} ${operatorSymbol} ${this.operand2()}`;
  });

  captchaAnswer = computed(() => this.evaluateCaptcha());

  get captchaInput(): FormControl {
    return this.employeeForm.get('captchaInput') as FormControl;
  }

  ngOnInit() {
    this.captchaInput.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((userAnswer) => {
        this.validateAnswerOnChange(userAnswer);
      });
  }

  isCaptchaValid(): boolean {
    const userAnswer = this.captchaInput.value?.trim();
    if (!userAnswer) {
      return false;
    }
    const numericAnswer = parseFloat(userAnswer);
    return !isNaN(numericAnswer) && Math.abs(numericAnswer - this.captchaAnswer()) < 0.01;
  }

  // Generate a new captcha
  generateCaptcha() {
    this.operator.set(this.randomOperator());

    const op1 = this.randomNumber(5, 10);
    const op2 = this.randomNumber(1, op1); 

    this.operand1.set(op1);
    this.operand2.set(op2);

    this.captchaInput.reset();
    this.captchaInput.setErrors(null);
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  private randomOperator(): string {
    const operators = ['+', '-', '*'];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  // Evaluate the captcha based on the operator and operands
  private evaluateCaptcha(): number {
    const op1 = this.operand1();
    const op2 = this.operand2();
    switch (this.operator()) {
      case '+': return op1 + op2;
      case '-': return op1 - op2;
      case '*': return op1 * op2;
      default: return 0;
    }
  }

  private validateAnswerOnChange(userAnswer: string | null | undefined) {
    if (userAnswer && userAnswer.trim() !== '') {
      const answer = Number(userAnswer);
      if (!isNaN(answer) && Math.abs(answer - this.captchaAnswer()) < 0.01) {
        this.captchaInput.setErrors(null);
      }
    }
  }

  validateAnswerOnBlur(userAnswer: string | null | undefined) {
    if (userAnswer && userAnswer.trim() !== '') {
      const answer = parseFloat(userAnswer);
      if (!isNaN(answer) && Math.abs(answer - this.captchaAnswer()) < 0.01) {
        this.captchaInput.setErrors(null);
      } else {
        this.captchaInput.setErrors({ incorrect: true });
      }
    } else {
      this.captchaInput.setErrors(null);
    }
  }

  get captchaErrorMessage() {
    if (this.captchaInput.hasError('incorrect')) {
      return 'Incorrect Validation Code, please try again.';
    }
    return '';
  }
}
