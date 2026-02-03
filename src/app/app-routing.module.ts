import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { TaskdashboardComponent } from './taskDashboard/taskdashboard/taskdashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
  // { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path: 'dashboard', component: TaskdashboardComponent},
  { path: 'projects', component: ProjectsComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const appRouting = [HeaderComponent, PageNotFoundComponent] 
