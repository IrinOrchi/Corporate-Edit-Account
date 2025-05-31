import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupComponent {
  @Input() label: string = '';
  @Input() control!: FormControl; // FormControl for the radio group
  @Input() options: string[] = []; // Array of options for the radio buttons
  @Input() isRequired: boolean = false; // Whether the field is required
  @Input() errorMessage: string = ''; // Custom error message
}
