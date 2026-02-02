export class ProjectModel {
    id: number;
    name: string;
    createdDate: Date;
    modifiedDate: Date;
    status: string;
    isActive: boolean;
  
    constructor(
      id: number,
      name: string,
      createdDate: Date,
      modifiedDate: Date,
      status: string,
      isActive: boolean
    ) {
      this.id = id;
      this.name = name;
      this.createdDate = createdDate;
      this.modifiedDate = modifiedDate;
      this.status = status;
      this.isActive = isActive;
    }
  }
  