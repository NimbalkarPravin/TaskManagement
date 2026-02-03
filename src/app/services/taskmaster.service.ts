import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class TaskMasterService {
  //private apiUrl = 'https://taskmanagementapi.bsite.net/api/TaskMaster/';
  //baseUrl: 'https://taskmanagementapi.bsite.net/'
  //private apiUrl = this.http.get(`${environment.baseUrl}/TaskMaster`);
  private apiUrl = environment.baseUrl;
  //private apiUrl = this.http.get(`${environment.baseUrl}/`);

  constructor(private http: HttpClient) {}

  getTaskMasterView( month: number, year: number, project: string, employee: string ): Observable<TaskMasterView[]> 
  {
    return this.http .get<TaskMasterView[]>
    (`${this.apiUrl}TaskMaster/GetTaskMasterView?month=${month}&year=${year}&project=${project}&employee=${employee}`) 
    .pipe( catchError(error => { console.error('Error fetching task master view:', error); 
      return of([] as TaskMasterView[]);
     }));
  }

  updateTaskMaster(id: number, task: SaveTaskModel): Observable<any> { 
    return this.http.put<any>(`${this.apiUrl}TaskMaster/${id}`, task).pipe( 
      catchError(error => { console.error('Error updating task master:', error);
         return of({ success: false, error }); }) ); 
  }

  createTaskMaster(task: SaveTaskModel): Observable<any> {debugger;
    return this.http.post<any>(`${this.apiUrl}TaskMaster/CreateTaskMaster`, task).pipe(
      catchError(error => {
        console.error('Error creating task master:', error);
        return of({ success: false, error });
      })
    );
  }

  deleteTaskMaster(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}TaskMaster/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting task master:', error);
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
  
  