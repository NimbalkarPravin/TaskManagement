import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskMasterService {
  private apiUrl = 'https://localhost:7128/api/TaskMaster/';
  //baseUrl: 'https://taskmanagementapi.bsite.net/'
  //this.http.get(`${environment.apiUrl}/items`);
  constructor(private http: HttpClient) {}

  getTaskMasterView( month: number, year: number, project: string, employee: string ): Observable<TaskMasterView[]> 
  {
    return this.http .get<TaskMasterView[]>
    (`${this.apiUrl}GetTaskMasterView?month=${month}&year=${year}&project=${project}&employee=${employee}`) 
    .pipe( catchError(error => { console.error('Error fetching task master view:', error); 
      return of([] as TaskMasterView[]);
     }));
  }

  updateTaskMaster(id: number, task: SaveTaskModel): Observable<any> { 
    return this.http.put<any>(`${this.apiUrl}${id}`, task).pipe( 
      catchError(error => { console.error('Error updating task master:', error);
         return of({ success: false, error }); }) ); 
  }

  createTaskMaster(task: SaveTaskModel): Observable<any> {debugger;
    return this.http.post<any>(`${this.apiUrl}CreateTaskMaster`, task).pipe(
      catchError(error => {
        console.error('Error creating task master:', error);
        return of({ success: false, error });
      })
    );
  }
  
}

  
export interface SaveTaskModel {  
    id: number;  
    projectId: number;
    activityCode: string;
    taskId: number;
    employeeId: number;
    hours: number;
    status: string;
    date: string; 
    isActive: boolean;
}

export interface TaskMasterView {
    projectName: string;
    activityCode: string;
    task: string;
    employee: string;
    hours: number;
    status: string;
    date: string; // or Date if you parse it
  }
  
  