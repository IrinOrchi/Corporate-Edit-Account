import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { LoginService } from '../../Services/login.service';
import { AuthService } from '../../Services/shared/auth.service';

@Component({
  selector: 'app-successful-account',
  standalone: true,
  imports: [],
  templateUrl: './successful-account.component.html',
  styleUrl: './successful-account.component.scss'
})
export class SuccessfulAccountComponent {
  // userName: string = '';
  // password: string = '';
  // loginFormErrorMessage: string = '';
  // isLoginApiCallPending = false;
  // urlParams = new URLSearchParams(window.location.search);
  
  // queryString: any = this.urlParams.get('selectedJobType')
  // ? this.urlParams.get('selectedJobType')
  // : '';

  // constructor(private router: Router, private loginService: LoginService, private authService: AuthService
  // ) {}
  // ngOnInit(): void {
  //   const storedCredentials = this.authService.getCredentials();
  //   if (storedCredentials.username && storedCredentials.password) {
  //     this.userName = storedCredentials.username;
  //     this.password = storedCredentials.password;
  //   }
  // }
  // onClickLoginButton() {
  //   this.loginFormErrorMessage = '';

  //   if (this.userName === '' && this.password === '') {
  //     this.loginFormErrorMessage = 'Enter a valid username and password.';
  //     return;
  //   } else if (this.userName === '') {
  //     this.loginFormErrorMessage = 'Enter a valid username.';
  //     return;
  //   } else if (this.password === '') {
  //     this.loginFormErrorMessage = 'Enter a valid password.';
  //     return;
  //   }

  //   this.isLoginApiCallPending = true;

  //   this.loginService.loginUser(this.userName, this.password).subscribe({
  //     next: (data) => {
  //       //debugger;
  //       if (
  //         data &&
  //         data.status === 200 &&
  //         data.message === 'User logged in successfully.' &&
  //         data.redirectUrl
  //       ) {
  //         this.loginService.setCookies().subscribe({
  //           next: (data) => {
              
  //             if (data) {
  //               console.log(data)
  //               if (this.queryString === '') {
  //                 window.location.href = 'https://recruiter.bdjobs.com/dashboard';
  //               } else {

  //                 setTimeout(() => {
  //                   console.log('This is the query string value on login -- ' + this.queryString);
  //                   const externalUrl = `https://recruiter.bdjobs.com/dashboard?selectedJobType=${encodeURIComponent(this.queryString)}`;
  //                   window.location.href = externalUrl;
  //                 }, 2000);
                  

  //                 // setTimeout(() => {
  //                 //   console.log('this is the query string valu on login -- '+this.queryString)
  //                 //   this.router.navigate(['dashboard'], { queryParams: { selectedJobType: this.queryString} });
  //                 // }, 2000);
                   
  //               }
  //             }
  //           },
  //         });
  //       } else {
  //         if (data) {
  //           this.loginFormErrorMessage = data.message;
  //           this.isLoginApiCallPending = false;
  //         } else {
  //           this.loginFormErrorMessage = 'An unknown error occurred.';
  //           this.isLoginApiCallPending = false;
  //         }
  //       }
  //     },
  //     error: () => {
  //       this.loginFormErrorMessage = "Couldn't connect to the server.";
  //       this.isLoginApiCallPending = false;
  //     },
  //   });
  // }
  
  // private handleSuccessfulLogin(redirectUrl: string): void {
  //   this.loginService.setCookies().subscribe({
  //     next: () => {
  //       if (this.authService.hasValidToken()) {
  //         window.location.href = 'https://recruiter.bdjobs.com/dashboard';
  //       } else {
  //         this.handleError('Login failed. Invalid token.');
  //       }
  //     },
  //     error: () => this.handleError('Failed to set authentication cookies.'),
  //   });
  // }
  
  // private handleError(message: string): void {
  //   this.loginFormErrorMessage = message;
  //   this.isLoginApiCallPending = false;
  // }
  
}





