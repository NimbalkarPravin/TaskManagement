export class TaskMasterModel {
    id: number;
    projectName: string;
    activityCode: string;
    task: string;
    hours: number;
    createdDate: Date;
    modifiedDate: Date;
    status: string;
    isActive: boolean;
  
    constructor(
      id: number,
      projectName: string,
      activityCode: string,
      task: string,
      hours: number,
      createdDate: Date,
      modifiedDate: Date,
      status: string,
      isActive: boolean
    ) {
      this.id = id;
      this.projectName = projectName;
      this.activityCode = activityCode;
      this.task = task;
      this.hours = hours;
      this.createdDate = createdDate;
      this.modifiedDate = modifiedDate;
      this.status = status;
      this.isActive = isActive;
    }
  }
  