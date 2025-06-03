import { Component, Input, Output, EventEmitter, HostListener, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <div 
        class="flex items-center w-full text-gray-600 font-medium cursor-pointer"
        (click)="toggleDropdown()"
      >
        <ng-content select="[dropdown-trigger]"></ng-content>
      </div>
      
      <div 
        *ngIf="isOpen"
        class="dropdown-menu fixed z-[9999] w-48 bg-white rounded-lg shadow-lg border border-gray-200"
        [style.left.px]="dropdownPosition.left"
        [style.top.px]="dropdownPosition.top"
      >
        <div class="py-1">
          <ng-content select="[dropdown-content]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      position: relative;
      z-index: 1;
    }
    .dropdown-menu {
      position: fixed !important;
      z-index: 9999;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-top: 0;
    }
  `]
})
export class DropdownComponent implements AfterViewInit {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  dropdownPosition = { top: 0, left: 0 };
  private isFirstOpen = true;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
    
    if (this.isOpen) {
      if (this.isFirstOpen) {
        this.cdr.detectChanges();
        requestAnimationFrame(() => {
          this.updateDropdownPosition();
          this.isFirstOpen = false;
        });
      } else {
        this.updateDropdownPosition();
      }
    }
  }

  private updateDropdownPosition() {
    const trigger = this.elementRef.nativeElement.querySelector('[dropdown-trigger]');
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-menu');
    if (!trigger || !dropdown) return;

    const triggerRect = trigger.getBoundingClientRect();
    const dropdownWidth = dropdown.offsetWidth;
    const windowWidth = window.innerWidth;
    
    const navComponent = document.querySelector('header');
    const navRect = navComponent?.getBoundingClientRect();
    
    let top = (navRect?.bottom || triggerRect.bottom);
    
    const isCreditOrSMS = triggerRect.width < 150;
    let left = triggerRect.left;
    
    if (isCreditOrSMS) {
      left = triggerRect.left - 50;
    }
    
    if (left < 0) {
      left = 0;
    }
    
    const rightEdge = left + dropdownWidth;
    if (rightEdge > windowWidth) {
      left = windowWidth - dropdownWidth - 10;
    }
    
    this.dropdownPosition = { top, left };
    this.cdr.detectChanges();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpen) {
      this.updateDropdownPosition();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.isOpenChange.emit(false);
    }
  }
} 