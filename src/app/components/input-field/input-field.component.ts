import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() errorMessage: string = '';
  @Input() maxLength: number = 20;
  @Input() isRequired!: boolean;
  @Input() type: string = 'text';
  @Input() icon?: string; 
  @Input() autocomplete: string = 'off';  
  @Input() control: FormControl<string> = new FormControl()
  @Input() disabled: boolean = false;
}
