import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-md shadow-lg relative">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  standalone: true,
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
}
