import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.baseUrl + 'Task/';

  constructor(private http: HttpClient) {}

  // Get all tasks
  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl + 'GetTaskList').pipe(
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return of([]);
      })
    );
  }

  // Get task by ID
  getTaskById(id: number): Observable<TaskModel | null> {
    return this.http.get<TaskModel>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching task with id ${id}:`, error);
        return of(null);
      })
    );
  }

  // Create new task
  createTask(task: TaskModel): Observable<TaskModel | null> {
    return this.http.post<TaskModel>(this.apiUrl + 'CreateTask', task).pipe(
      catchError(error => {
        console.error('Error creating task:', error);
        return of(null);
      })
    );
  }

  // Update task
  updateTask(id: number, task: TaskModel): Observable<TaskModel | null> {
    return this.http.put<TaskModel>(`${this.apiUrl}${id}`, task).pipe(
      catchError(error => {
        console.error(`Error updating task with id ${id}:`, error);
        return of(null);
      })
    );
  }

  // Delete task
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting task with id ${id}:`, error);
        return of(null);
      })
    );
  }
}

export interface TaskModel {
  id: number;
  name: string;
  status: string;
  isActive: boolean;
}
