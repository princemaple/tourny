import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginGuard} from './login.guard';
import {TournamentFormComponent} from './tournament-form/tournament-form.component';
import {TournamentSetupComponent} from './tournament-setup/tournament-setup.component';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'tournaments/:id/setup',
    component: TournamentSetupComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'tournaments/:id/edit',
    component: TournamentFormComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'tournaments/new',
    component: TournamentFormComponent,
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
