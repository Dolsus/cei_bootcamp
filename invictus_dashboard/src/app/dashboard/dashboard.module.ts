import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DashboardData } from './services/dashboard-data';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardTaskEditComponent } from './components/dashboard-task-edit/dashboard-task-edit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, DashboardTaskEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    InMemoryWebApiModule.forRoot(DashboardData),
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
