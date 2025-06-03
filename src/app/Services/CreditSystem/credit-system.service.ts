import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { LoginService } from '../shared/login.service';
import { CreditSystem} from '../../layouts/nav/class/navbarResponse';

@Injectable({
  providedIn: 'root',
})
export class CreditSystemService {
  private readonly DOMAIN_PARAM = window.location.href.includes('gateway')
    ? 'domain=gateway&'
    : window.location.href.includes('localhost')
    ? 'domain=lbh&'
    : '';
  private creditSystemUrl =
    // 'https://corporate3.bdjobs.com/CreditSystemDataForDashboard.asp?domain=lbh';
    'https://corporate3.bdjobs.com/CreditSystemDataForDashboard.asp?' +
    this.DOMAIN_PARAM;

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {}
  callCreditSystemCheckReferral(comid: string, comname: string, token: string) {
    const url =
      // 'https://corporate3.bdjobs.com/CreditSystem-Check-Referral.asp?domain=test4';
      'https://corporate3.bdjobs.com/CreditSystem-Check-Referral.asp?domain=recruiter';
    const body = new URLSearchParams();
    body.set('comid', comid);
    body.set('comname', comname);
    body.set('token', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.httpClient.post<any>(url, body.toString(), {
      headers,
      withCredentials: true,
    });
  }
}