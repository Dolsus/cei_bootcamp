import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuestsComponent } from './quests/quests.component';
import { CompanionsComponent } from './companions/companions.component';
import { FactionsComponent } from './factions/factions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestsComponent,
    CompanionsComponent,
    FactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
