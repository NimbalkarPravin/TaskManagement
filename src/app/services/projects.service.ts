import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectModel } from '../models/project';
import { TaskModel } from '../models/task';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // Adjust the API URL to match your backend
  //private apiUrl = 'https://localhost:7128/api/';
  //private apiUrl = 'https://taskmanagementapi.bsite.net/api/';
  private apiUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  // Get all projects
  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(this.apiUrl + 'Project/GetProjectList').pipe(
      catchError(error => {
        console.error('Error fetching projects:', error);
        return of([]);
      })
    );
  }

  // Get all projects
  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl + 'TaskMaster/GetTaskList').pipe(
      catchError(error => {
        console.error('Error fetching task:', error);
        return of([]);
      })
    );
  }

  // Get project by ID
  getProjectById(id: number): Observable<ProjectModel | null> {
    return this.http.get<ProjectModel>(`${this.apiUrl}Project/GetProject/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching project with id ${id}:`, error);
        return of(null);
      })
    );
  }

  // Create new project
  createProject(project: ProjectModel): Observable<ProjectModel | null> {
    const payload = {
      id: project.id,
      projectName: project.name,   // map Angular "name" → API "ProjectName"
      status: project.status,
      isActive: project.isActive
    };
  
    return this.http.post<ProjectModel>(this.apiUrl + 'Project/CreateProject', payload).pipe(
      catchError(error => {
        console.error('Error creating project:', error);
        return of(null);
      })
    );
  }
  

// Update project
updateProject(id: number, project: ProjectModel): Observable<ProjectModel | null> {
  const payload = {
    id: project.id,
    projectName: project.name,  // must match backend DTO
    status: project.status,
    isActive: project.isActive
  };

  return this.http.put<ProjectModel>(`${this.apiUrl}Project/${id}`, payload).pipe(
    catchError(error => {
      console.error(`Error updating project with id ${id}:`, error);
      return of(null);
    })
  );
}

// Delete project
deleteProject(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}Project/${id}`).pipe(
    catchError(error => {
      console.error(`Error deleting project with id ${id}:`, error);
      return of(null);
    })
  );
}

  

}
