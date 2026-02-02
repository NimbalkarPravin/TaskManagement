export class EmployeeModel {
    id: number;
    firstName: string;
    lastName: string;
    createdDate: Date;
    modifiedDate: Date;
    isActive: boolean;
  
    constructor(
      id: number,
      firstName: string,
      lastName: string,
      createdDate: Date,
      modifiedDate: Date,
      isActive: boolean
    ) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.createdDate = createdDate;
      this.modifiedDate = modifiedDate;
      this.isActive = isActive;
    }
  }
  
  