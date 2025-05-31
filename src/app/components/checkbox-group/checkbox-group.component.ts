import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports:[ReactiveFormsModule],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent {
  @Input() id!: string; // Unique identifier for the checkbox
  @Input() name!: string; // Name attribute
  @Input() value!: any; // Value of the checkbox
  @Input() label!: string; // Label text
  @Input() control: FormControl<string> = new FormControl()
  @Input() customClasses: string = ''; // Custom styling classes

  @Output() changed = new EventEmitter<boolean>(); // Output for change events

  onCheckboxChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.changed.emit(checked);
  }
}
