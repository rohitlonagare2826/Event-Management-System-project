import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'organizer',
    component: OrganizerComponent,
    canActivate: [authGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard],
    data: { role: 'user' }
  },

  { path: '**', redirectTo: 'login' }
];
