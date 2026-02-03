import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/projects.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SaveTaskModel, TaskMasterService, TaskMasterView } from 'src/app/services/taskmaster.service';
import { EmployeeModel } from 'src/app/models/employee';
import { ProjectModel } from 'src/app/models/project';
import { TaskModel } from 'src/app/models/task';

type DateCol = { key: string; label: string; weekday: string; isWeekend: boolean };

declare var bootstrap: any; 

@Component({
  selector: 'app-taskdashboard',
  templateUrl: './taskdashboard.component.html',
  styleUrls: ['./taskdashboard.component.scss']
})
export class TaskdashboardComponent implements OnInit, OnDestroy {
  form: FormGroup;
  filterform: FormGroup;
  leaveForm!: FormGroup;

  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' },   { value: 4, name: 'April' },
    { value: 5, name: 'May' },     { value: 6, name: 'June' },
    { value: 7, name: 'July' },    { value: 8, name: 'August' },
    { value: 9, name: 'September' },{ value: 10, name: 'October' },
    { value: 11, name: 'November' },{ value: 12, name: 'December' }
  ];
  years: number[] = [];
  projects: ProjectModel[] = [];
  selectedprojects: ProjectModel[] = [];
  employees: EmployeeModel[] = [];
  tasks: TaskModel[] = [];
  selectedTask: any = null;
  dateColumns: DateCol[] = [];
  records: TaskMasterView[] = [];  
  mode: 'create' | 'edit' = 'create';



  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private taskMasterService: TaskMasterService
  ) {

    this.filterform = this.fb.group({
      month: [new Date().getMonth() + 1],
      year: [new Date().getFullYear()],
      project: [''],
      employee: ['']
    });

    this.form = this.fb.group({ 
      month: [new Date().getMonth() + 1],
      year: [new Date().getFullYear()],
      project: ['', Validators.required], 
      employee: ['', Validators.required],       
      activityCode: ['', Validators.required], 
      task: ['', Validators.required], 
      hours: ['', [Validators.required, Validators.min(1)]], 
      status: ['', Validators.required],
      date: ['', Validators.required] });

      this.leaveForm = this.fb.group({
        employee: ['', Validators.required],
        date: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 2; i--) {
      this.years.push(i);
    }

    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
      this.selectedprojects = data;      
    });
    
    this.projectService.getTasks().subscribe(data => {
      this.tasks = data;  
    });
    
    this.employeeService.getEmployees().subscribe(data => this.employees = data);

    this.generateDateColumns();
    this.loadTaskData();
    this.filterform.valueChanges.subscribe(() => { this.onFilterChange(); });
  }

  generateDateColumns(): void {
    const { month, year } = this.filterform.value;
    this.dateColumns = [];
  
    const daysInMonth = new Date(year, month, 0).getDate();
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month - 1, day);
  
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const label = `${weekday}, ${day} ${this.months[month - 1].name} ${year}`;
      const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
      const isWeekend = weekday === 'Saturday' || weekday === 'Sunday';
  
      this.dateColumns.push({
        key,
        label,
        weekday,
        isWeekend
      });
    }
  }
  

  loadTaskData(): void {
    const { month, year, project, employee } = this.filterform.value;
    this.taskMasterService.getTaskMasterView(month, year, project, employee).subscribe(data => {
      this.records = data;      
    });
  }

  getTasks(empName: string, dateKey: string): TaskMasterView[] {
    return this.records.filter(r =>
      r.employee === empName &&
      r.date.startsWith(dateKey) // match YYYY-MM-DD
    );
  }
  
  openCreateTask() {
    this.mode = 'create';
    this.selectedTask = null;
    this.form.reset(); // clear form for new task
  }
  
  editTask(task: any) {
    this.mode = 'edit';
    this.selectedTask = task;
    const formattedDate = task.date ? task.date.split('T')[0] : '';
    const list = this.selectedprojects.filter(p => p.name === task.projectName);
  
    this.form.patchValue({
      project: list.length ? list[0].name : '',
      activityCode: task.activityCode,
      task: task.task,
      hours: task.hours,
      status: task.status,
      date: formattedDate,
      employee: task.employee
    });
  }
    
  saveTask() {
    if (this.form.valid) {      
      const updated = { ...this.selectedTask, ...this.form.value };
  
      const project = this.projects.find(p => p.name === updated.project);
      const projectId = project ? project.id : 0;
  
      const employeeId = this.employees.find(
        e => `${e.firstName} ${e.lastName}` === updated.employee
      )?.id || 0;
  
      const taskId = this.tasks.find(t => t.name === updated.task)?.id || 0;
  
      const saveModel: SaveTaskModel = {
        id: updated.id || 0,
        projectId : projectId,
        taskId : taskId,
        employeeId : employeeId,
        activityCode: updated.activityCode,
        hours: updated.hours,
        status: updated.status,
        isActive: true,
        date: updated.date
      };
     
  const request$ = saveModel.id
  ? this.taskMasterService.updateTaskMaster(saveModel.id, saveModel)
  : this.taskMasterService.createTaskMaster(saveModel);

request$.subscribe({
  next: () => {
    this.showAlert(
      saveModel.id ? 'Task updated successfully!' : 'Task created successfully!',
      'success'
    );
    this.loadTaskData();
    // Close modal
    const modalElement = document.getElementById('addEditModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement)
        || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  },
  error: (err) => {
    console.error(saveModel.id ? 'Error updating task:' : 'Error creating task:', err);
    this.showAlert(
      saveModel.id ? 'Error updating task!' : 'Error creating task!',
      'danger'
    );
  }
  });     
      
 }

  }
  
  showAlert(message: string, type: 'success' | 'danger' | 'info' | 'warning') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type} small-alert`;
    alertBox.innerText = message;
  
    // Insert into alert container near header
    const container = document.getElementById('alert-container');
    if (container) {
      container.innerHTML = ''; // clear old alerts
      container.appendChild(alertBox);
    }
  
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  }
  
  deleteTask(task: any) {   
    this.taskMasterService.deleteTaskMaster(task.id).subscribe({
      next: () => {
        this.showAlert('Task deleted successfully!', 'success');
        this.loadTaskData();
        // Close modal
        const modalElement = document.getElementById('addEditModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement)
            || new bootstrap.Modal(modalElement);
          modalInstance.hide();
        }
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.showAlert('Error deleting task!', 'danger');
      }
    });
    
  }

  confirmLeave(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      const confirmed = window.confirm('Are you sure you want to mark this as Leave?');
      if (confirmed) {        
        checkbox.checked = false;
        // Close the modal programmatically       
      } else {
        // User cancelled → uncheck the box
        checkbox.checked = false;
      }
    }
  }
  
  // applyLeave(): void {
  //   if (this.leaveForm.valid) {
  //     const leaveData = this.leaveForm.value;
      
  //     this.leaveForm.reset();
  //   } else {
  //     this.leaveForm.markAllAsTouched();
  //   }
  // }

  applyLeave() {
    if (this.leaveForm.valid) {     
      const updated = { ...this.selectedTask, ...this.leaveForm.value };
        const employeeId = this.employees.find(
        e => `${e.firstName} ${e.lastName}` === updated.employee
      )?.id || 0;
 
      const saveModel: SaveTaskModel = {
        id: 0,
        projectId : 1,
        taskId : 1,
        employeeId : employeeId,
        activityCode: 'Leave',
        hours: 1,
        status: 'Leave',
        isActive: true,
        date: updated.date
      };
     debugger;
		this.taskMasterService.createTaskMaster(saveModel).subscribe({
		  next: () => {
			this.showAlert('Leave apply successfully!','success');
			this.loadTaskData();
			// Close modal
			const modalElement = document.getElementById('leaveModal');
			if (modalElement) {
			  const modalInstance = bootstrap.Modal.getInstance(modalElement)
				|| new bootstrap.Modal(modalElement);
			  modalInstance.hide();
			}
		  },
		  error: (err) => {
			console.error('Error in leave apply:', err);
			this.showAlert('Error in leave apply:','danger');
			}
		});     
		  
	} 
}

  clearFilters(): void {
    this.filterform.reset({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      project: '',
      employee: ''
    });
  }

  onFilterChange(): void {
    this.generateDateColumns();
    this.loadTaskData();
  }

  ngOnDestroy(): void {}
}
