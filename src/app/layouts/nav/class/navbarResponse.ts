export interface cvSearchService {
    startingDate: string;
    endingDate: string;
    id: number;
    limit: number;
    available: number;
    viewed: number;
  }
  
  export interface JobPostingService {
    startingDate: string;
    endingDate: string;
    basicListLimit: number;
    id: number;
    maxJob: number;
    maxStandout: number;
    standoutLimit: number;
    standoutPremiumLimit: number;
    maxStandoutPremium: number;
    basicWhiteCollarLimit: number;
    standOutCollarLimit: number;
    standOutPremiumCollarLimit: number;
    basicBlueCollarLimit: number;
    standOutBlueCollarLimit: number;
    standOutPremiumBlueCollarLimit: number;
    basicBlueCollarPosted: number;
    standOutBlueCollarPosted: number;
    standOutPremiumBlueCollarPosted: number;
    jobPostingAccessForWhiteColler: number;
  }
  
  export interface CreditSystem {
    haveTokenAccess: boolean;
    validityDate: string;
    totalCredit: number;
    remainingCredit: number;
    tokenStatus: string;
    tokenSubmitted: boolean;
  }
  
  export interface SalesPersonData {
    salesPersonName: string;
    salesPersonDesignation: string;
    salesPersonContact: string;
    salesPersonEmail: string;
    salesPersonImage: string;
    smsPurchased: number;
    smsSend: number;
    smsRemaining: number;
    smsPackage: boolean;
    cvSearchAccess: boolean;
    remainingDaysCv: number;
    remainingCv: string;
    jobPostingAccess: boolean;
    jobPostingLimit: string;
    remainingDaysJob: number;
    isCompanyBlackListed: boolean;
    cvSearchService?: cvSearchService;
    jobPostingService?: JobPostingService;
    creditSystem?: CreditSystem;
  }
  
  export interface NavResponse {
    status: number;
    message: string;
    data: SalesPersonData;
  }
  