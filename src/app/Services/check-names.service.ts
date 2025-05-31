import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; 
import { CheckNamesResponseDTO, CompanyNameCheckRequestDTO, IndustryTypeResponseDTO, IndustryType, LocationRequestDTO, LocationResponseDTO, IndustryTypeRequestDTO, RLNoRequestModel, CreateAccountResponseDTO } from '../Models/company';

@Injectable({
  providedIn: 'root',
})
export class CheckNamesService {
 
  private apiUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/CheckNames'; 
  private industryApiUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/IndustryType' ; 
  private industryIdApiUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/Industries';
  private locationApiUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/GetLocations'; 
  private rlnoapiUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/RlNoCheck';
  private organizationCheckUrl = 'https://api.bdjobs.com/employeraccount/api/CorporateCommon/OrganizationCheck';
  private insertAccountApiUrl = 'https://api.bdjobs.com/employeraccount/api/CreateAccount/insert';
  constructor(private http: HttpClient) {}


  organizationCheck(organizationName: string): Observable<any> {
    if (!organizationName || organizationName.trim() === '') {
      return throwError(() => new Error('OrganizationName is required.'));
    }

    const url = `${this.organizationCheckUrl}?OrganizationName=${encodeURIComponent(organizationName)}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error checking organization name:', error);
        return throwError(() => new Error('Error checking organization name'));
      })
    );
  }


  // Check for unique username
  checkUniqueUserName(userName: string): Observable<CheckNamesResponseDTO> {
    if (!userName || userName.length < 3 || userName.length > 20) {
      return throwError(() => new Error('UserName must be between 3 and 20 characters.'));
    }

    const request: CompanyNameCheckRequestDTO = {
      Name: userName, 
      CheckFor: 'u', 
    };

    return this.http.post<CheckNamesResponseDTO>(this.apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error checking username:', error);
        return throwError(() => new Error('Error checking username'));
      })
    );
  }

  // Check for unique company name
  checkUniqueCompanyName(companyName: string): Observable<CheckNamesResponseDTO> {
    if (!companyName) {
      return throwError(() => new Error('CompanyName is required.'));
    }

    const request: CompanyNameCheckRequestDTO = {
      Name: companyName,  
      CheckFor: 'c', 
    };

    return this.http.post<CheckNamesResponseDTO>(this.apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error checking company name:', error);
        return throwError(() => new Error('Error checking company name'));
      })
    );
  }

  // Fetch industry types from API using POST method
  fetchIndustryTypes(IndustryId?: number): Observable<IndustryTypeResponseDTO[]> {
    const request: IndustryTypeRequestDTO = {
      IndustryId: IndustryId ?? undefined,  
      OrganizationText: '',                 
      CorporateID: undefined                
    };

    return this.http.post<IndustryTypeResponseDTO[]>(this.industryApiUrl, request).pipe(
      catchError((error) => {
        console.error('Error fetching industry types:', error);
        return throwError(() => new Error('Error fetching industry types'));
      })
    );
  }

  // Fetch industry names based on type
  fetchIndustryNamesByType(industryId: number): Observable<IndustryTypeResponseDTO[]> {
    const request: IndustryTypeRequestDTO = {
      IndustryId: industryId,  
      OrganizationText: '',   
      CorporateID: undefined  
    };
  
    return this.http.post<IndustryTypeResponseDTO[]>(this.industryApiUrl, request).pipe(
      catchError((error) => {
        console.error('Error fetching industry names:', error);
        return throwError(() => new Error('Error fetching industry names'));
      })
    );
  }

  // Get all industry IDs
  getAllIndustryIds(): Observable<IndustryType[]> {
    return this.http.get<any>(this.industryIdApiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching industries:', error);
        return throwError(() => new Error('Failed to fetch industries'));
      })
    );
  }

  // Method to get locations (districts, countries, or thanas)
  getLocations(requestPayload: LocationRequestDTO): Observable<LocationResponseDTO[]> {
    return this.http.post<LocationResponseDTO[]>(this.locationApiUrl, requestPayload).pipe(
      catchError((error) => {
        console.error('Error fetching locations', error);
        return throwError(() => new Error('Error fetching locations'));
      })
    );
  }

  //  payload for locations
  private createRequestPayload(outsideBd: boolean, districtId: string = ''): LocationRequestDTO {
    return {
      OutsideBd: outsideBd ? '1' : '0',
      DistrictId: districtId,
    };
  }

  fetchDistrictsOrCountries(outsideBd: boolean): Observable<LocationResponseDTO[]> {
    const requestPayload = this.createRequestPayload(outsideBd);
    return this.getLocations(requestPayload);
  }

  // Fetch thanas based on districtId
  fetchThanas(districtId: string): Observable<LocationResponseDTO[]> {
    const requestPayload = this.createRequestPayload(false, districtId);
    return this.getLocations(requestPayload);
  }

  
  // Method to verify RL number
  verifyRLNo(request: RLNoRequestModel): Observable<any> {
    return this.http.post(this.rlnoapiUrl, request);
  }
 

 
  // Method to insert account data
  insertAccount(data: any): Observable<CreateAccountResponseDTO> {
    return this.http.post<CreateAccountResponseDTO>(this.insertAccountApiUrl, data).pipe(
      catchError((error) => {
        console.error('Error inserting account data:', error);
        return throwError(() => new Error('Failed to insert account data'));
      })
    );
  }
}
