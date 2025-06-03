import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import initializePreline from './app/preline-init';

// Initialize Preline
initializePreline();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
