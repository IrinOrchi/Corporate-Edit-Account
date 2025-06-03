import { Component, HostListener } from '@angular/core';
import { ModalComponent } from '../modal/modal.component'; // Import ModalComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ModalComponent, CommonModule]  // Import ModalComponent here
})
export class HeaderComponent {
  isDropdownOpen: boolean = false; // Credit dropdown state
  isUserDropdownOpen: boolean = false; // User dropdown state
  hasCredit: boolean = false;
  showReferralError: boolean = false;
  activeModal: string | null = null;

  toggleDropdown() {
    if (this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleUserDropdown() {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  openModal(modalId: string) {
    this.activeModal = modalId;
  }

  closeModal() {
    this.activeModal = null;
  }

  submitReferralCode() {
    this.showReferralError = true;
    setTimeout(() => {
      this.showReferralError = false;
      this.openModal('crdtSuccess'); 
    }, 1000);
  }

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const isClickInsideDropdown = target.closest('#dropdownButton, #dropdownMenu1');

  if (!isClickInsideDropdown) {
    this.closeAllDropdowns();
  }
}

private closeAllDropdowns() {
  this.isDropdownOpen = false;
  this.isUserDropdownOpen = false;
}
}
