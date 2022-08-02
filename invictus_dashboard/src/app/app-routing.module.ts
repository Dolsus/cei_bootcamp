import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanionsComponent } from './companions/companions.component';
import { FactionsComponent } from './factions/factions.component';
import { HomeComponent } from './home/home.component';
import { QuestsComponent } from './quests/quests.component';
import { LoginComponent } from './shared/security/components/login/login.component';
import { AuthGuard } from './shared/security/guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'quests',
    component: QuestsComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessWiki' },
  },
  {
    path: 'factions',
    component: FactionsComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessWiki' },
  },
  {
    path: 'companions',
    component: CompanionsComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'canAccessWiki' },
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
