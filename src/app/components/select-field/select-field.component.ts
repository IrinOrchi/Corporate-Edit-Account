import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})



export class SelectFieldComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() options: { value: string, label: string }[] = [];
  // @Input() selectedValue: string = '';
  @Input() errorMessage: string = '';
  @Input() isRequired: boolean = true;
  @Input() control: FormControl<string> = new FormControl()
}
