import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoggedComponent } from './pages/logged/logged.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileComponent } from './pages/logged/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LoggedComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'logged', component: LoggedComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
