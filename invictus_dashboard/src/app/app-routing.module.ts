import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanionsComponent } from './companions/companions.component';
import { FactionsComponent } from './factions/factions.component';
import { HomeComponent } from './home/home.component';
import { QuestsComponent } from './quests/quests.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'quests', component: QuestsComponent},
  {path: 'factions', component: FactionsComponent},
  {path: 'companions', component: CompanionsComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
