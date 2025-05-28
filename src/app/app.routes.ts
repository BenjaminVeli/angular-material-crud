import { Routes } from '@angular/router';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

export const routes: Routes = [
    { path: '', component: ListEmployeeComponent },
    { path: 'edit/:id', component: EditEmployeeComponent },
    { path: 'add', component: AddEmployeeComponent },
];
