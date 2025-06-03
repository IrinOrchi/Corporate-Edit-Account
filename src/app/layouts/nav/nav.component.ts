import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { CreditSystem, cvSearchService, JobPostingService, NavResponse, SalesPersonData } from './class/navbarResponse';
import { CommonModule } from '@angular/common';
import { NoCreditComponent } from '../../components/no-credit/no-credit.component';
import { ModalService } from '../../Services/modal/modal.service';
import { CompanyName, CompanyLogoUrl, IsAdminUser, CompanyIdLocalStorage,UserId} from '../../enums/app.enums';
import { LocalstorageService } from '../../Services/shared/essentials/localstorage.service';
import { NavbarService } from './services/navbar.service';
import { SalesPersonData, CreditSystem, cvSearchService, JobPostingService, NavResponse } from './class/navbarResponse';
import { reinitializePreline } from '../../preline-init';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule,CommonModule, DropdownComponent, ModalComponent, NoCreditComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit, AfterViewInit{
  @Output() navbarDataLoaded = new EventEmitter<SalesPersonData>();
  creditSystem: CreditSystem = {} as CreditSystem;
  cvSearchService: cvSearchService = {} as cvSearchService;
  jobPostingService: JobPostingService = {} as JobPostingService;
  currentDate: string = '';
  isExpired: boolean = false;
  cvBankPercentage: number = 0;
  navData: any;
  smsPercent=0;

  loadingCreditSystem = signal(true);  
  loadingCvSearchService = signal(true); 
  loadingJobPostingService = signal(true);
  
  navbarService= inject(NavbarService);
  localStorageService= inject(LocalstorageService);
  modalService= inject(ModalService);
  remainingBasicJobs=0;
  maxBasicJobs=0;
  remainingStandoutJobs=0;
  remainingStandoutPremiumJobs=0;
  maxStandoutJobs=0;
  maxStandoutPremiumJobs=0;
  jobPostingAccessPercentage: number=0;
  companyName: string = window.localStorage.getItem(CompanyName) || '';
  companyLogoURL: string = window.localStorage.getItem(CompanyLogoUrl) || 'https://recruiter.bdjobs.com/assets/images/default-company.png';
  isAdminUser: boolean = window.localStorage.getItem(IsAdminUser) === 'true';

  ngOnInit(): void {
    this.getNavbar();
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    // Initial Preline initialization
    reinitializePreline();
  }

  checkExpiration(validityDate: string): boolean {
    if (!validityDate) return true;
    const today = new Date(this.currentDate);
    const expiry = new Date(validityDate);
    return expiry < today;
  }

  getNavbar() {
    const companyId = this.localStorageService.getItem(CompanyIdLocalStorage);
    const userId = this.localStorageService.getItem(UserId);
    this.navbarService.getNavbarData({ companyId, userId }).subscribe({
      next: (res: NavResponse) => {
        this.navbarDataLoaded.emit(res.data as SalesPersonData);
        this.navData = res.data;
        const rawSmsPercent = (this.navData.smsRemaining * 100) / this.navData.smsPurchased;
        this.smsPercent = rawSmsPercent < 1.5 ? 1 : Math.ceil(rawSmsPercent);
        this.smsPercent = this.smsPercent < 0 ? 0 : this.smsPercent;

        this.creditSystem = (res.data.creditSystem ?? {}) as CreditSystem;
        this.cvSearchService = (res.data.cvSearchService ?? {}) as cvSearchService;
        this.jobPostingService = (res.data.jobPostingService ??{}) as JobPostingService;

        this.loadingCreditSystem.set(this.isObjectEmpty(this.creditSystem));
        this.loadingCvSearchService.set(this.isObjectEmpty(this.cvSearchService));
        this.loadingJobPostingService.set(this.isObjectEmpty(this.jobPostingService));

        this.cvBankPercentage = Math.floor((this.cvSearchService.available*100) / this.cvSearchService.limit);
        this.jobPostingAssessShow();

        // Reinitialize Preline after data is loaded
        setTimeout(() => {
          reinitializePreline();
        }, 0);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  openAddCreditModal(): void {
    this.modalService.setModalConfigs({
      attributes: {
        modalWidth: '700px',
      },
      inputs: {},
      componentRef: NoCreditComponent
    });
  }
  isObjectEmpty(obj: any): boolean {
    return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0);
  }  

  jobPostingAssessShow() {

      this.remainingBasicJobs =
        this.jobPostingService?.basicListLimit ?? 0;

      this.maxBasicJobs = this.jobPostingService?.maxJob ?? 0;

      this.remainingStandoutJobs =
        this.jobPostingService?.standoutLimit ?? 0;
      this.maxStandoutJobs =
        this.jobPostingService?.maxStandout ?? 0;

      this.remainingStandoutPremiumJobs =
        this.jobPostingService?.standoutPremiumLimit ?? 0;

      this.maxStandoutPremiumJobs =
        this.jobPostingService?.maxStandoutPremium ?? 0;

      const remainingJobsSum =
        this.remainingBasicJobs +
        this.remainingStandoutJobs +
        this.remainingStandoutPremiumJobs;
        
      const maxJobsSum =
        this.maxBasicJobs + this.maxStandoutJobs + this.maxStandoutPremiumJobs;

      if (maxJobsSum > 0) {
        this.jobPostingAccessPercentage = Math.round(
          (remainingJobsSum / maxJobsSum) * 100
        );
      }
    }
  }
  

