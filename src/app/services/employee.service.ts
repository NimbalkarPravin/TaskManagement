import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeModel } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Adjust the API URL to match your backend
  private apiUrl = 'https://localhost:7128/api/Employee/';

  constructor(private http: HttpClient) {}

  // Get all employees
  getEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.apiUrl + 'GetEmployeeList').pipe(
      catchError(error => {
        console.error('Error fetching employees:', error);
        return of([]);
      })
    );
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<EmployeeModel | null> {
    return this.http.get<EmployeeModel>(`${this.apiUrl}GetEmployee/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching employee with id ${id}:`, error);
        return of(null);
      })
    );
  }

  // Create new employee
  createEmployee(employee: EmployeeModel): Observable<EmployeeModel | null> {
    return this.http.post<EmployeeModel>(this.apiUrl + 'CreateEmployee', employee).pipe(
      catchError(error => {
        console.error('Error creating employee:', error);
        return of(null);
      })
    );
  }

  // Update employee
  updateEmployee(id: number, employee: EmployeeModel): Observable<EmployeeModel | null> {
    return this.http.put<EmployeeModel>(`${this.apiUrl}UpdateEmployee/${id}`, employee).pipe(
      catchError(error => {
        console.error(`Error updating employee with id ${id}:`, error);
        return of(null);
      })
    );
  }

  // Delete employee
  deleteEmployee(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}DeleteEmployee/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting employee with id ${id}:`, error);
        return of(false);
      })
    );
  }
}
