import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  @Input() targetId: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    const targetElement = document.getElementById(this.targetId);
    if (targetElement) {
      targetElement.classList.toggle('hidden');
      
      // Close other dropdowns
      document.querySelectorAll('.hs-dropdown-menu').forEach((menu) => {
        if (menu.id !== this.targetId) {
          menu.classList.add('hidden');
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target) && !document.getElementById(this.targetId)?.contains(target)) {
      document.getElementById(this.targetId)?.classList.add('hidden');
    }
  }
} 