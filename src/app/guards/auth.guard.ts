import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../Services/shared/login.service';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService, 
    private router: Router,
    private loginService: LoginService
  ) {}

  // canActivate() {
  //   // Check if we have a valid token
  //   return this.loginService.validToken().pipe(
  //     map(isValid => {
  //       if (!isValid) {
  //         // Token is invalid or expired, redirect to login
  //         window.location.replace('https://recruiter.bdjobs.com');
  //         return false;
  //       }
  //       return true;
  //     }),
  //     catchError(() => {
  //       // If there's an error checking the token, redirect to login
  //       window.location.replace('https://recruiter.bdjobs.com');
  //       return of(false);
  //     })
  //   );
  // }
   canActivate(): boolean {
    const companyId: string = window.localStorage.getItem('CompanyId') ?? '';
    if (companyId == "") {
      parent.location.replace('https://recruiter.bdjobs.com');
      return false;
    }
    return true;
  };
}
