import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EmployeeModel } from '../models/employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeModel[] = [];
  selectedEmployee: EmployeeModel | null = null;
  mode: 'create' | 'edit' = 'create';
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'info' = 'success';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  showAlert(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }

  openCreateEmployee(): void {
    this.mode = 'create';
    this.selectedEmployee = {
      id: 0,
      firstName: '',
      lastName: '',
      createdDate: new Date(),
      modifiedDate: new Date(),
      isActive: true
    };
  }

  editEmployee(employee: EmployeeModel): void {
    this.mode = 'edit';
    this.selectedEmployee = { ...employee };
  }

  saveEmployee(): void {
    if (!this.selectedEmployee) return;

    if (this.mode === 'create') {
      this.employeeService.createEmployee(this.selectedEmployee).subscribe(result => {
        if (result) {
          this.loadEmployees();
          this.showAlert('Employee created successfully!', 'success');
        }
      });
    } else {
      this.employeeService.updateEmployee(this.selectedEmployee.id, this.selectedEmployee).subscribe(result => {
        if (result) {
          this.loadEmployees();
          this.showAlert('Employee updated successfully!', 'info');
        }
      });
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(res => {
        if (res) {
          this.loadEmployees();
          this.showAlert('Employee deleted successfully!', 'danger');
        }
      });
    }
  }
}
