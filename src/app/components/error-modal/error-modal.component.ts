import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {

  @Output() modalClosed = new EventEmitter<void>();

  closeModal(): void {
    this.modalClosed.emit();
  }
}
