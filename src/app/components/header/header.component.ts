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

  // Toggles the Credit dropdown visibility
  toggleDropdown() {
    // Close User dropdown if it's open
    if (this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
    // Toggle the Credit dropdown
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Toggles the User dropdown visibility
  toggleUserDropdown() {
    // Close Credit dropdown if it's open
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    // Toggle the User dropdown
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // Opens the specified modal
  openModal(modalId: string) {
    this.activeModal = modalId;
  }

  // Closes the currently open modal
  closeModal() {
    this.activeModal = null;
  }

  // Simulates submitting a referral code
  submitReferralCode() {
    // Fake validation for referral code
    this.showReferralError = true;
    // Simulate a successful submission after some time
    setTimeout(() => {
      this.showReferralError = false;
      this.openModal('crdtSuccess'); // Open success modal
    }, 1000);
  }

// Close dropdowns when clicking outside
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const isClickInsideDropdown = target.closest('#dropdownButton, #dropdownMenu1');

  if (!isClickInsideDropdown) {
    this.closeAllDropdowns();
  }
}

// Close all dropdowns
private closeAllDropdowns() {
  this.isDropdownOpen = false;
  this.isUserDropdownOpen = false;
}
}
