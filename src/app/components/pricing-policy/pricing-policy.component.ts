import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-policy.component.html',
  styleUrl: './pricing-policy.component.scss'
})
  export class PricingPolicyComponent {
    visibility: { [key: string]: boolean } = {
      pricingPolicy: false,
      standardListing: false,
      premium: false,
      hotJobs: false,
      cvBankAccess: false
    };
  
    toggleContent(section: string): void {
      this.visibility[section] = !this.visibility[section];
    }
  }


