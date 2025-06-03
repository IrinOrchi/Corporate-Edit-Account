import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModalService } from '../../Services/modal/modal.service';
import { CreditSystemService } from '../../Services/CreditSystem/credit-system.service';
import { LoginService } from '../../Services/shared/login.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreditSystem, NavResponse, SalesPersonData } from '../../layouts/nav/class/navbarResponse';
import { GatewayDataSharingService } from '../../Services/shared/gateway-data-sharing.service';

@Component({
  selector: 'app-no-credit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './no-credit.component.html',
  styleUrl: './no-credit.component.scss'
})
export class NoCreditComponent implements OnInit {
  referralCodeControl = new FormControl('');
  errorMessage: string = '';
  isLoading: boolean = false;
  companyId: string = '';
  companyName: string = '';
  creditSystem: CreditSystem | undefined;
  serviceData?: SalesPersonData;
  isNotCreditExpired: boolean = false;




  constructor(
    private modalService: ModalService,
    private creditSystemService: CreditSystemService,
    private loginService: LoginService,
    public gatewayDataSharingService: GatewayDataSharingService,

  ) {}

  ngOnInit(): void {
    this.companyId = window.localStorage.getItem('CompanyId') ?? '';
    this.companyName = window.localStorage.getItem('CompanyName') ?? '';
  }

  closeModal() {
    this.modalService.closeModal();
  }
  setServiceData(): void {
    let comId: string = window.localStorage.getItem('CompanyId') ?? '';
    let uId: string = window.localStorage.getItem('UserId') ?? '';

    this.loginService.getServiceData(comId, uId).subscribe((response: any) => {
      this.loginService.setServiceData(response.data);
    });
  }
  submitReferralCode() {
    const referralCode = this.referralCodeControl.value?.trim();
    
    if (!referralCode) {
      this.errorMessage = 'Please enter a referral code';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.creditSystemService
      .callCreditSystemCheckReferral(this.companyId, this.companyName, referralCode)
      .pipe(
        tap((response) => {
          this.isLoading = false;
          
          const userId = window.localStorage.getItem('UserId') ?? '';
          this.loginService.deleteServiceDataFromRadis(this.companyId, userId).subscribe();
          
          setTimeout(() => {
            this.setServiceData();
            // this.refreshServiceData();
          }, 2000);

          const message = response.Message?.toLowerCase();
          if (message === 'approved') {
            this.closeModal();
            this.setCreditSystem();
          } else if (message === 'pending') {
            this.closeModal();
          } else if (message === 'rejected') {
            this.closeModal();
          } else if (message === 'invalidtoken') {
            this.errorMessage = 'Invalid referral code. Please enter a valid referral code.';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }),
        catchError((error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred. Please try again.';
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  // refreshServiceData() {
  //   this.closeModal();
  // }

  setCreditSystem() {
    // this.creditSystemService.getCreditSystem().subscribe({
    //   next: (data) => {

    //   },
    // });

    this.creditSystem = this.serviceData?.creditSystem;
    // this.supportingInfo = userData;
    // this.creditSystem = creditSystems[0];
    // console.log(this.creditSystem, 'c');
    const validityDate = this.creditSystem?.validityDate ?? '';
    if (
      this.gatewayDataSharingService.getParseDate(validityDate) >=
      this.gatewayDataSharingService.getCurrentDateTime()
    ) {
      this.isNotCreditExpired = true;
    }
  }
}
