import { inject, Injectable } from '@angular/core';
// import { JobInfoService } from '../../../../shared/services/job-info.service';
// import { JobNoLocalStorage } from '../../../enums/app.enums';
// import { LocalstorageService } from '../../../Services/shared/essentials/localstorage.service';

// @Injectable({
//   providedIn: 'root'
// })
export class PnplService {
//   jobInfoService = inject(JobInfoService);
//   localstorageService=inject(LocalstorageService);

//   pnplPayment(index:number): void {
//     const baseUrl = 'https://corporate3.bdjobs.com/Applicant_Process_ContactPurchase.asp';

//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = baseUrl;
//     form.target = '_blank';
  
//     const addHiddenField = (name: string, value: string) => {
//       const input = document.createElement('input');
//       input.type = 'hidden';
//       input.name = name;
//       input.value = value;
//       form.appendChild(input);
//     };
//     const jobId =this.localstorageService.getItem(JobNoLocalStorage);
  
//     addHiddenField('hdInvoiceOrJobId1',jobId );
//     addHiddenField('hdInvoiceOrJobValue1', this.jobInfoService.getJobInfo()?.data.jobTitle ?? '');
//     addHiddenField('CVD', 'All*#*icon-taka*#*prip'+index);
//     addHiddenField('hidSuccessCvUrl', `https://corporate3.bdjobs.com/Applicant-Hiring-Activity-Process.asp?from=recruiter&jobno=${jobId}&ref=`);
  
//     document.body.appendChild(form);
  
//     setTimeout(() => {
//       form.submit();
//       document.body.removeChild(form);
//     }, 0);
//   }

 }
