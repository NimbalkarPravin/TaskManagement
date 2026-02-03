import { Component, OnInit } from '@angular/core';
import { ProjectModel } from '../models/project';
import { ProjectService } from '../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: ProjectModel[] = [];
  selectedProject: ProjectModel | null = null;
  mode: 'create' | 'edit' = 'create';

  // Alert message
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'info' = 'success';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // Load all projects
  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  // Show alert for 3 seconds
  showAlert(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }

  // Open modal for creating new project
  openCreateProject(): void {
    this.mode = 'create';
    this.selectedProject = {
      id: 0,
      name: '',
      createdDate: new Date(),
      modifiedDate: new Date(),
      status: 'Open',
      isActive: true
    };
  }

  // Open modal for editing project
  editProject(project: ProjectModel): void {
    this.mode = 'edit';
    this.selectedProject = { ...project };
  }

  // Save project (create or update)
  saveProject(): void {
    if (!this.selectedProject) return;

    if (this.mode === 'create') {
      this.projectService.createProject(this.selectedProject).subscribe(result => {
        if (result) {
          this.loadProjects();
          this.showAlert('Project created successfully!', 'success');
        }
      });
    } else {
      this.projectService.updateProject(this.selectedProject.id, this.selectedProject).subscribe(result => {
        if (result) {
          this.loadProjects();
          this.showAlert('Project updated successfully!', 'info');
        }
      });
    }
  }

  // Delete project
  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(success => {
        if (success) {
          this.loadProjects();
          this.showAlert('Project deleted successfully!', 'danger');
        }
      });
    }
  }
}
