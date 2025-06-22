export interface CompanyNameCheckRequestDTO {
    Name: string; 
    CheckFor: string; 
}

export interface CheckNamesResponseDTO {
    isUnique: boolean; 
    message: string; 
}
export interface IndustryTypeResponseDTO {
    IndustryValue: number;  
    IndustryName: string; 
  }
  
  export interface IndustryTypeRequestDTO {
    IndustryId?: number;  
    OrganizationText?: string;  
    CorporateID?: number;  
  }
  export interface LocationResponseDTO {
    OptionValue: string;
    OptionText: string;
    flagPath: string;

  }
  
  export interface LocationRequestDTO {
    DistrictId: string;  
    OutsideBd: string;    
  }
  export interface IndustryType{
    IndustryId: number;
    IndustryName: string;
    OrganizationName: string
}
export interface RLNoRequestModel {
  RLNo: string;
}


export interface RLNoResponseModel {
  error: string;
  rlNo: number;
  company_Name: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
export interface CreateAccountResponseDTO {
  Message: string;
  CorporateAccountID: number;
}
export interface ContactPerson {
  contactId: number;
  contactName: string;
  designation: string;
  mobile: string;
  email: string;
}



// export interface OrganizationRequestDTO {
//   OrganizationName: string; }
// export interface OrganizationCheckResponseDTO {
//   responseType: string;  
//   dataContext: string;   
//   responseCode: number;  
//   requestedData: string; 
//   data: any;            
// }

export interface UpdateAccountRequestModel {
  industryTypeArray: string;
  preIndustryTypes: string;
  companyId: string;
  industryName: string;
  country: string;
  companyName: string;
  companyNameBangla: string;
  district: string;
  thana: string;
  outSideBdCompanyAddress: string;
  companyAddress: string;
  outSideBdCompanyAddressBng: string;
  companyAddressBng: string;
  outSideCity: string;
  rlNo: string;
  billingAddress: string;
  billingContact: string;
  billingEmail: string;
  contactId: number;
  facilityForDisability: number;
  yearsOfEstablishMent: number;
  companySize: string;
  userId: string;
  tradeNo: string;
  webUrl: string;
  businessDesc: string;
  inclusionPolicy: number;
  support: number;
  training: number;
  disabilityWrap: number[];
}

export interface CompanyLogoResponse {
  responseType: string;
  dataContext: null;
  responseCode: number;
  requestedData: null;
  data: CompanyLogo[];
}

export interface CompanyLogo {
  logoName: string;
  isActive: number;
}

export interface CompanyLogoUploadResponse {
  responseType: string;
  dataContext: null;
  responseCode: number;
  requestedData: null;
  data: {
    filePath: string;
  };
}

export interface CompanyLogoValidationError {
  errorCode: number;
  name: string;
  invalidValue: string;
  message: string;
}

export interface CompanyLogoErrorResponse {
  responseType: string;
  dataContext: CompanyLogoValidationError[];
  responseCode: number;
  requestedData: null;
  data: null;
}

export interface CompanyLogoDeleteRequest {
  companyId: string;
  logoName: string;
}

export interface CompanyLogoDeleteResponse {
  responseType: string;
  dataContext: null;
  responseCode: number;
  requestedData: null;
  data: string;
}

export interface CompanyLogoUpdateRequest {
  companyId: string;
  logoName?: string;
}

export interface CompanyLogoUpdateResponse {
  responseType: string;
  dataContext: null;
  responseCode: number;
  requestedData: null;
  data: string;
}
