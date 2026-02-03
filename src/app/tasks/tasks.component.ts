import { Component, OnInit } from '@angular/core';
import { TaskModel, TaskService } from '../services/task.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;
  mode: 'create' | 'edit' = 'create';
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'info' = 'success';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  showAlert(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }

  openCreateTask(): void {
    this.mode = 'create';
    this.selectedTask = { id: 0, name: '', status: 'Open', isActive: true };
  }

  editTask(task: TaskModel): void {
    this.mode = 'edit';
    this.selectedTask = { ...task };
  }

  saveTask(): void {
    if (!this.selectedTask) return;

    if (this.mode === 'create') {
      this.taskService.createTask(this.selectedTask).subscribe(result => {
        if (result) {
          this.loadTasks();
          this.showAlert('Task created successfully!', 'success');
        }
      });
    } else {
      this.taskService.updateTask(this.selectedTask.id, this.selectedTask).subscribe(result => {
        if (result) {
          this.loadTasks();
          this.showAlert('Task updated successfully!', 'info');
        }
      });
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(res => {
        if (res) {
          this.loadTasks();
          this.showAlert('Task deleted successfully!', 'danger');
        }
      });
    }
  }
}
