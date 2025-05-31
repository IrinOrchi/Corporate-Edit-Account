import { Component,Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss'
})
export class TextAreaComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() errorMessage: string = '';
  @Input() maxLength: number = 300;
  @Input() isRequired: boolean = true;
  @Input() rows: number = 3;
  @Input() control: FormControl<string> = new FormControl()
}
