import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JobNoLocalStorage } from '../../../enums/app.enums';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private isBrowser: boolean;

  private jobNo!: string;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setItem(key: string, value: string): void {
    if (key === JobNoLocalStorage) {
      this.jobNo = value;
    }
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string {
    if (this.jobNo && key === JobNoLocalStorage) {
      return this.jobNo;
    }
    if (this.isBrowser && localStorage.getItem(key)) {
      if (typeof localStorage.getItem(key) === 'string') {
        return localStorage.getItem(key) as string;
      } else if (typeof localStorage.getItem(key) === 'object') {
        return JSON.stringify(localStorage.getItem(key));
      }
    }

    return '';
  }
}
