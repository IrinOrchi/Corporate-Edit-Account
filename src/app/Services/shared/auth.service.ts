import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserCredentials } from '../../Models/company';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private credentialsSubject = new BehaviorSubject<UserCredentials>({
    username: '',
    password: '',
  });

  credentials$: Observable<UserCredentials> =
    this.credentialsSubject.asObservable();

  constructor(private cookieService: CookieService) {}

  updateCredentials(credentials: UserCredentials): void {
    this.credentialsSubject.next(credentials);
  }

  clearCredentials(): void {
    this.credentialsSubject.next({ username: '', password: '' });
  }

  getCredentials(): UserCredentials {
    return this.credentialsSubject.value;
  }

  hasValidToken(): boolean {
    const token = this.cookieService.get('AUTHTOKEN');
    return !!token; // Check if token exists
  }
}
