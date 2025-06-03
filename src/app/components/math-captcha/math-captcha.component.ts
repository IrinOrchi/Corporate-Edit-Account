import { Component, OnInit, signal, computed, Input } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputFieldComponent } from '../input-field/input-field.component';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent],
  templateUrl: './math-captcha.component.html',
  styleUrls: ['./math-captcha.component.scss']
})
export class MathCaptchaComponent implements OnInit {
  @Input() employeeForm!: FormGroup;

  operand1 = signal(this.randomNumber());
  operand2 = signal(this.randomNumber());
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
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((userAnswer) => {
        this.validateAnswerOnChange(userAnswer);
      });
  }
  isCaptchaValid(): boolean {
    const userAnswer = parseFloat(this.captchaInput.value ?? '');
    return !isNaN(userAnswer) && Math.abs(userAnswer - this.captchaAnswer()) < 0.01; 
  }

  generateCaptcha() {
    this.operator.set(this.randomOperator());

    if (this.operator() === '-') {
      const [op1, op2] = [this.randomNumber(), this.randomNumber()];
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else if (this.operator() === '*') {
      const [op1, op2] = [this.randomNumber(), this.randomNumber()].sort((a, b) => a - b);
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else if (this.operator() === '/') {
      let op1 = this.randomNumber();
      let op2 = this.randomNumber();
      while (op2 === 0) {
        op2 = this.randomNumber();
      }
      if (op1 < op2) [op1, op2] = [op2, op1]; 
      this.operand1.set(op1);
      this.operand2.set(op2);
    } else {
      this.operand1.set(this.randomNumber());
      this.operand2.set(this.randomNumber());
    }

    // Reset the captcha input and clear errors
    this.captchaInput.reset();
    this.captchaInput.setErrors(null);
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  private randomOperator(): string {
    const operators = ['+', '-', '*', '/'];
    return operators[Math.floor(Math.random() * operators.length)];
  }

  private evaluateCaptcha(): number {
    const op1 = this.operand1();
    const op2 = this.operand2();
    switch (this.operator()) {
      case '+': return op1 + op2;
      case '-': return op1 - op2;
      case '*': return op1 * op2;
      case '/': return parseFloat((op1 / op2).toFixed(2));
      default: return 0;
    }
  }

  // Validate answer on input change without setting errors
  private validateAnswerOnChange(userAnswer: string | null | undefined) {
    if (userAnswer && userAnswer.trim() !== '') {
      const answer = Number(userAnswer);
      if (!isNaN(answer) && Math.abs(answer - this.captchaAnswer()) < 0.01) {
        this.captchaInput.setErrors(null);
      }
    }
  }

  // Validate on blur to set errors and show the error message
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
