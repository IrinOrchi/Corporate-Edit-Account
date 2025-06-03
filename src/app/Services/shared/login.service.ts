import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
  windowWhen,
} from 'rxjs';
import { GatewayDataSharingService } from './gateway-data-sharing.service';
// import { SupportingInfo } from '../models/Gateway/SupportingInfo';
import { CookieService } from 'ngx-cookie-service';
import { InvalidTokenError, jwtDecode, JwtPayload } from 'jwt-decode';
import { CompanyCookies } from '../../Models/Shared/CompanyCookies';
import { Route } from '@angular/router';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { NavResponse } from '../../layouts/nav/class/navbarResponse';
import { SupportingInfo } from '../../Models/Shared/SupportingInfo';
import { UserLoginInformation } from '../../Models/Shared/UserLoginInformationModel';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly DOMAIN_PARAM = window.location.href.includes('gateway')
    ? 'domain=gateway&'
    : window.location.href.includes('localhost')
    ? 'domain=lbh&'
    : '';

  private readonly DOMAIN_PARAM_ONLY = window.location.href.includes('gateway')
    ? '?domain=gateway'
    : '';
  // private readonly DOMAIN_PARAM = window.location.href.includes('test4')
  //   ? 'domain=test4&'
  //   : '';

  // private readonly DOMAIN_PARAM_ONLY = window.location.href.includes('test4')
  //   ? '?domain=test4'
  //   : '';

  private readonly API_ENDPOINT: string =
    // 'https://testr.bdjobs.com/authentication/api/authentication';
    // 'https://gateway.bdjobs.com/authentication/api/Authentication';
    'https://recruiter.bdjobs.com/authentication/api/Authentication';
  // 'https://testmongo.bdjobs.com/test_redwan/api/Authentication';
  private readonly LEGACY_LOGIN_ENDPOINT: string =
    'https://corporate3.bdjobs.com/SupportingData-test.asp';

  private readonly LEGACY_SIGNOUT_ENDPOINT: string =
    'https://corporate3.bdjobs.com/LogOutDataClear.asp';

  private readonly LOGIN_STATUS_VERIFICATION_ENDPOINT =
    'https://corporate3.bdjobs.com/supportingInfo.asp';

  private readonly LOGIN_TOKEN_ENDPOINT: string =
    'https://testmongo.bdjobs.com/v1/api/Auth/get-token';

  private readonly GET_SERVICE_DATA_ENDPOINT: string = 'https://recruiter.bdjobs.com/authentication/api/services';

  private readonly CHECK_IS_PASS_UPDATED: string = 'https://corporate3.bdjobs.com/api/v1/CorporateAutoLogout.asp';

  public isRedirectingToLegacySite = new BehaviorSubject<boolean>(false);

  public readonly LOCAL_STORAGE_KEYS = {
    COMPANY_ID: 'CompanyId',
    COMPANY_NAME: 'CompanyName',
    USER_ID: 'UserId',
    USER_NAME: 'UserName',
    COMPANY_LOGO_URL: 'CompanyLogoUrl',
    COMPANY_COUNTRY: 'CompanyCountry',
    IS_ENTREPRENEUR_COMPANY: 'IsEntrepreneurCompany',
    IS_ADMIN_USER: 'IsAdminUser',
    PAYMENT_PROCESS: 'PaymentProcess',
    VERIFICATION_STATUS: 'VerificationStatus',
    TOTAL_POSTED_JOB: 'TotalPostedJob',
    SUPPORT_PERSON_NAME: 'SupportPersonName',
    SUPPORT_PERSON_DESIGNATION: 'SupportPersonDesignation',
    SUPPORT_PERSON_PHONE: 'SupportPersonPhone',
    SUPPORT_PERSON_EMAIL: 'SupportPersonEmail',
    SUPPORT_PERSON_IMAGE: 'SupportPersonImage',
    HAS_CV_BANK_ACCESS: 'HasCvBankAccess',
    CV_BANK_REMAINING: 'CvBankRemaining',
    CV_BANK_MAX: 'CvBankMax',
    CV_BANK_VIEWED: 'CvBankViewed',
    HAS_JOB_POSTING_ACCESS: 'HasJobPostingAccess',
    JOB_POSTING_BASIC_REMAINING: 'JobPostingBasicRemaining',
    JOB_POSTING_BASIC_MAX: 'JobPostingBasicMax',
    JOB_POSTING_STANDOUT_REMAINING: 'JobPostingStandoutRemaining',
    JOB_POSTING_STANDOUT_MAX: 'JobPostingStandoutMax',
    JOB_POSTING_STANDOUT_PREMIUM_REMAINING:
      'JobPostingStandoutPremiumRemaining',
    JOB_POSTING_STANDOUT_PREMIUM_MAX: 'JobPostingStandoutPremiumMax',
    Company_Created_At: 'CreatedAt',
    Job_Fair_Job_Count: 'TotalJobfairJob',
    Employee_Max_Size: 'EmployeeMaxSize',
    Employee_Id: 'EmployeeId',
  };


  private serviceInfoData = new BehaviorSubject<NavResponse | undefined>(undefined);
  public serviceInfoData$ = this.serviceInfoData.asObservable();
  // public companyId: string = '';
  // public userId: string = '';
  // public decodeId: string = '';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private gatewayDataSharingService: GatewayDataSharingService
  ) {}



  setServiceData(value: any): void {
    this.serviceInfoData.next(value);
  }

  getServiceData(companyId: string, userId: string): Observable<NavResponse> {
    return this.httpClient.post<NavResponse>(this.GET_SERVICE_DATA_ENDPOINT, {companyId, userId});
  }

  deleteServiceDataFromRadis(companyId: string, userId: string): Observable<any> {
    return this.httpClient.delete(this.GET_SERVICE_DATA_ENDPOINT+'/cache', {body: {companyId, userId}});
  }

  // deleteServiceDataFromRadis(companyId: string, userId: string): Observable<any> {
  //   const url = this.GET_SERVICE_DATA_ENDPOINT;
  //   const options = {
  //     body: { companyId, userId }
  //   };
  //   return this.httpClient.request('delete', url, options);
  // }


  loginUser(
    userName: string,
    password: string
  ): Observable<UserLoginInformation> {
    return this.httpClient.post<UserLoginInformation>(this.API_ENDPOINT, {
      userName,
      password,
    });
  }

  refreshByToken(): Observable<UserLoginInformation> {
    const token = this.cookieService.get('REFTOKEN');
    if (token) {
      return this.httpClient
        .get<UserLoginInformation>(`${this.API_ENDPOINT}?refreshtoken=${token}`)
        .pipe(
          tap((data)=> {
            if(data.message.trim().toLowerCase() == "invalid credentials."){
              this.clearAppData().subscribe({
                next: () => {
                  // window.location.replace('https://gateway.bdjobs.com');
                  window.location.replace('https://recruiter.bdjobs.com');
                },
                error: () => {
                  // window.location.replace('https://gateway.bdjobs.com');
                  window.location.replace('https://recruiter.bdjobs.com');
                },
              });
            }
          }),
          catchError((error) => {
            console.error('Error refreshing token', error);
            return throwError(() => new Error('Error refreshing token'));
          })
        );
    } else {
      // Return an observable that emits an error if the token is not found
      return throwError(() => new Error('Refresh token not found'));
    }
  }

  // AuthToken(): string {
  //   const token = this.cookieService.get('AUTH_TOKEN');
  //   return token;
  // }
  // getAuthenticationToken(userId: string, companyId: string, decodeId: string) {
  //   return this.httpClient.post(
  //     this.LOGIN_TOKEN_ENDPOINT,
  //     {
  //       userId,
  //       companyId,
  //       decodeId,
  //     },
  //     { withCredentials: true }
  //   );
  // }

  setCookies() {
    let companyId = '';
    let userId = '';
    this.getCompanyCookies().subscribe({
      next: (data) => {
        if (data) {
          companyId = data.ComNo;
          userId = data.ComUsrAcc;
        }
      },
    });
    return this.httpClient.get(
      `${this.LEGACY_LOGIN_ENDPOINT}?${this.DOMAIN_PARAM}ComID=${companyId}&ComUsrAcc=${userId}`,
      { withCredentials: true }
    );
  }



  getSupportingInfo(): Observable<SupportingInfo | null> {
    return this.getUserLoginData().pipe(
      map((data) => {
        if (data.SupportingInfo) {
          return JSON.parse(data.SupportingInfo) as SupportingInfo;
        } else {
          throw new Error('SupportingInfo not found in user data');
        }
      }),
      catchError((error) => {
        console.error('Error in getSupportingInfo:', error);
        return of(null); // or handle the error as needed
      })
    );
  }

  getCompanyId(): Observable<string | null> {
    return this.getUserLoginData().pipe(
      map((data) => {
        if (data.CompanyId) {
          return data.CompanyId as string;
        } else {
          throw new Error('CompanyId not found in user data');
        }
      }),
      catchError((error) => {
        console.error('Error in getCompanyId:', error);
        return of(null); // or handle the error as needed
      })
    );
  }

  getUserId(): Observable<string | null> {
    return this.getUserLoginData().pipe(
      map((data) => {
        if (data.UserId) {
          return data.UserId as string;
        } else {
          throw new Error('UserId not found in user data');
        }
      }),
      catchError((error) => {
        console.error('Error in getUserId:', error);
        return of(null); // or handle the error as needed
      })
    );
  }

  getCompanyCookies(): Observable<CompanyCookies | null> {
    return this.getUserLoginData().pipe(
      map((data) => {
        if (data.CompanyCookie) {
          return JSON.parse(data.CompanyCookie) as CompanyCookies;
        } else {
          throw new Error('CompanyCookie not found in user data');
        }
      }),
      catchError((error) => {
        console.error('Error in getCompanyCookies:', error);
        return of(null); // or handle the error as needed
      })
    );
  }

  getUserLoginData(): Observable<any> {
    try {
      const token = this.cookieService.get('AUTHTOKEN');
      if (token) {
        const decodedToken = this.decodeToken<JwtPayload>(token);

        return of(decodedToken);
      } else {
        console.log('Token not found');
        return of({ notLoggedIn: true });
      }
    } catch (error) {
      console.error('Error retrieving user login data:', error);
      return of({ notLoggedIn: true });
    }
  }

  validToken(): Observable<boolean> {
    return this.getUserLoginData().pipe(
      map((data) => {
        if (data && data.exp) {
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
          return data.exp > currentTime;
        }
        return false; // Consider token without expiration date as non-expiring
      }),
      catchError(() => of(false)) // In case of any error, assume token is expired
    );
  }

  private decodeToken<T>(token: string): T {
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      throw new Error('Error decoding JWT');
    }
  }
  clearAppData(): Observable<any> {
    window.sessionStorage.clear();
    window.localStorage.clear();
    return this.deleteRefreshToken().pipe(
      switchMap((data) => {
        if (data) {
          console.log(data.message);
          this.cookieService.deleteAll();
        }
        return this.httpClient.get(
          `${this.LEGACY_SIGNOUT_ENDPOINT}${this.DOMAIN_PARAM_ONLY}`,
          { withCredentials: true }
        );
      }),
      catchError((error) => {
        console.error('Error during sign-out process', error);
        return of(null); // Return an observable to allow the process to continue
      })
    );
  }

  deleteRefreshToken(): Observable<any> {
    const refreshToken = this.cookieService.get('REFTOKEN');
    const params = new HttpParams().set('refreshtoken', refreshToken);
    return this.httpClient.delete(this.API_ENDPOINT, {
      params,
      withCredentials: true,
    });
  }

  checkIsPasswordChanged(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      // Add any other headers as needed
    });

    const options = {
      headers,
    };

    return this.httpClient.post(this.CHECK_IS_PASS_UPDATED, this.serializeFormData(data), options);
  }

  // Helper function to serialize form data
  private serializeFormData(data: any): string {
    const formData = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.set(key, data[key]);
      }
    }
    return formData.toString();
  }


  setLegacyApiDataToLocalStorage(data: SupportingInfo) {
    this.gatewayDataSharingService.setSupportingInfoToSharedService(data);
    if (data) {
      // debugger;
      if (data.EmployeeMaxSize && data.EmployeeMaxSize > 0) {
        // console.log('EmployeeMaxSize :', data.EmployeeMaxSize);

        window.localStorage.setItem('companySizePopUp', 'submitted');
      } else {
        window.localStorage.setItem('companySizePopUp', '');
      }
      // data = data;
      this.getCompanyId().subscribe({
        next: (cId) => {
          if (cId) {
            window.localStorage.setItem(
              this.LOCAL_STORAGE_KEYS.COMPANY_ID,
              cId
            );
          }
        },
      });
      if (data) {
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.Job_Fair_Job_Count,
          data.TotalJobfairJob.toString()
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.COMPANY_NAME,
          data.Name
        );

        this.getUserId().subscribe({
          next: (uid) => {
            if (uid) {
              window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.USER_ID, uid);
            }
          },
        });
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.Employee_Id, data.EmployeeId ? data.EmployeeId.toString() : '0'
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.USER_NAME,
          data.UserName
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.IS_ADMIN_USER,
          data.AdminUserType ? 'true' : 'false'
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.IS_ENTREPRENEUR_COMPANY,
          data.EntrepreneurCompany ? 'true' : 'false'
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.COMPANY_COUNTRY,
          data.CompanyCountry
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.PAYMENT_PROCESS,
          data.PaymentProcess ? 'true' : 'false'
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.VERIFICATION_STATUS,
          data.VerificationStatus ? 'true' : 'false'
        );
        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.TOTAL_POSTED_JOB,
          data.TotalPostedJob.toString()
        );

        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.HAS_CV_BANK_ACCESS,
          data.CvSearchAccess ? 'true' : 'false'
        );

        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.Company_Created_At,
          data.CreatedDate
        );
        window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.Employee_Max_Size, data.EmployeeMaxSize.toString())

        if (data.CvSearchService) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.CV_BANK_REMAINING,
            '0'
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.CV_BANK_REMAINING,
            data.CvSearchService.Available
              ? data.CvSearchService.Available.toString()
              : ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.CV_BANK_MAX,
            data.CvSearchService.Limit
              ? data.CvSearchService.Limit.toString()
              : ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.CV_BANK_VIEWED,
            data.CvSearchService.Viewed
              ? data.CvSearchService.Viewed.toString()
              : ''
          );
        }

        window.localStorage.setItem(
          this.LOCAL_STORAGE_KEYS.HAS_JOB_POSTING_ACCESS,
          data.JobPostingAccess ? 'true' : 'false'
        );
        if (data.JobPostingAccess && data.JobPostingService) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_BASIC_REMAINING,
            data.JobPostingService.BasicListLimit?.toString() ?? ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_BASIC_MAX,
            data.JobPostingService.MaxJob?.toString() ?? ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_STANDOUT_REMAINING,
            data.JobPostingService.StandoutLimit?.toString() ?? ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_STANDOUT_MAX,
            data.JobPostingService.MaxStandout?.toString() ?? ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_STANDOUT_PREMIUM_REMAINING,
            data.JobPostingService.StandoutPremiumLimit?.toString() ?? ''
          );
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.JOB_POSTING_STANDOUT_PREMIUM_MAX,
            data.JobPostingService.MaxStandoutPremium?.toString() ?? ''
          );
        }

        if (data.SalesPersonName) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_NAME,
            data.SalesPersonName
          );
        }

        if (data.SalesPersonDesignation) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_DESIGNATION,
            data.SalesPersonDesignation
          );
        }

        if (data.SalesPersonImage) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_IMAGE,
            data.SalesPersonImage
          );
        }

        if (data.SalesPersonContact) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_PHONE,
            data.SalesPersonContact
          );
        }

        if (data.SalesPersonEmail) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.SUPPORT_PERSON_EMAIL,
            data.SalesPersonEmail
          );
        }

        if (data.CompanyActiveLogoURL) {
          window.localStorage.setItem(
            this.LOCAL_STORAGE_KEYS.COMPANY_LOGO_URL,
            data.CompanyActiveLogoURL
          );
        }
      }
    }
  }

  increaseAuthTokenExpiration(): void {
    console.log('Increasing token expiration');
    const cookieNames = ['AUTHTOKEN', 'REFTOKEN', 'LoggedInDateTime', 'Company'];
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 20);

    cookieNames.forEach((cookieName) => {
      const cookieValue = this.cookieService.get(cookieName);
      if (cookieValue) {
        document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; domain=.bdjobs.com`;
      }
    });
  }



}
