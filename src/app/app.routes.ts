import { Routes } from '@angular/router';
import { EditAccountPageComponent } from './pages/edit-account-page/edit-account-page.component';
import { SuccessfulAccountComponent } from './pages/successful-account/successful-account.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'edit',
        pathMatch: 'full'
    },
    {
        path:'edit',
        component: EditAccountPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "account-created-successfully",
        component: SuccessfulAccountComponent,
        canActivate: [AuthGuard]
    },
   
];