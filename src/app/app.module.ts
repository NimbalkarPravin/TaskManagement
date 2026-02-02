import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { appRouting, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeService } from './services/employee.service';
import { SharedService } from './services/shared.service';
import { TaskdashboardComponent } from './taskDashboard/taskdashboard/taskdashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    appRouting,
    TaskdashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SharedService, EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
