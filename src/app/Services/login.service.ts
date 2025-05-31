import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { UserLoginInformation } from '../Models/Shared/UserLoginInformationModel';
import { map, catchError, of } from 'rxjs';
import { CompanyCookies } from '../Models/Shared/CompanyCookies';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
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

  private readonly API_ENDPOINT: string =    'https://recruiter.bdjobs.com/authentication/api/Authentication';
  private readonly LEGACY_LOGIN_ENDPOINT: string = 'https://corporate3.bdjobs.com/SupportingData-test.asp';


  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  loginUser(
    userName: string,
    password: string
  ): Observable<UserLoginInformation> {
    return this.http.post<UserLoginInformation>(this.API_ENDPOINT, {
      userName,
      password,
    });
  }

  
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
    return this.http.get(
      `${this.LEGACY_LOGIN_ENDPOINT}?${this.DOMAIN_PARAM}ComID=${companyId}&ComUsrAcc=${userId}`,
      { withCredentials: true }
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
        return of(null); 
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

  private decodeToken<T>(token: string): T {
    try {
      return jwtDecode<T>(token);
    } catch (error) {
      throw new Error('Error decoding JWT');
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
