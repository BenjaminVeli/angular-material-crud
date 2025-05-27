import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss'
})
export class ListEmployeeComponent {
  employeeForm: FormGroup = new FormGroup({});

  employeeObj: EmployeeModel = new EmployeeModel();

  employeeList: EmployeeModel[] = [];

  constructor() {
    this.createForm();
    // debugger;
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

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empid'].value);
    if (record != undefined) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.email = this.employeeForm.controls['email'].value;
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }


}
