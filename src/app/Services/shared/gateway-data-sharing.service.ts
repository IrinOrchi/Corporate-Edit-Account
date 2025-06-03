import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupportingInfo } from '../../Models/Shared/SupportingInfo';
@Injectable({
  providedIn: 'root',
})
export class GatewayDataSharingService {
  constructor() {}
  private supportingInfo = new BehaviorSubject<any | null>(null);
  public supportingInfo$ = this.supportingInfo.asObservable();
  setSupportingInfoToSharedService(supportingInfo: any): void {
    this.supportingInfo.next(supportingInfo);
  }

  getSupportingInfoFromSharedService(): any | null {
    return this.supportingInfo.value ?? null;
  }

  getCurrentDateTime(): Date {
    const currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    return currentDate;
  }
  getParseDate(inputDate: string): Date {
    if (inputDate.length > 0) {
      const [datePart, timePart] = inputDate.split(' ');
      const [month, day, year] = datePart.split('/');

      //   console.log("Month:", month);
      //   console.log("Day:", day);
      //   console.log("Year:", year);

      // Construct the date object
      const date = new Date(`${year}-${month}-${day}`);
      return date;
    } else {
      return new Date(0);
    }
  }
  formatDate(inputDate: string): string {
    const [datePart, timePart] = inputDate.split(' ');
    const [month, day, year] = datePart.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
      date
    );
    return formattedDate;
  }
}
