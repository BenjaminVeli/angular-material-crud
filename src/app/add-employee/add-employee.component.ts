import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  employeeForm: FormGroup = new FormGroup({});

  employeeObj: EmployeeModel = new EmployeeModel();

  employeeList: EmployeeModel[] = [];

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem('EmpData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empid: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      email: new FormControl(this.employeeObj.email),
      pinCode: new FormControl(this.employeeObj.pinCode),
      state: new FormControl(this.employeeObj.state),
    });
  }

  onSave() {
    const oldData = localStorage.getItem('EmpData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empid'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  resetForm() {
    this.employeeForm.reset();
  }
}
