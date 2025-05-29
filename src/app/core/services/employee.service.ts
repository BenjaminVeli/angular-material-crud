import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../model/Employee';

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {
    private apiUrl = "http://localhost:5000/api/employees";

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<EmployeeModel[]> {
        return this.http.get<EmployeeModel[]>(`${this.apiUrl}/list-employee`);
    }

    getEmployeeById(id: string): Observable<EmployeeModel> {
        return this.http.get<EmployeeModel>(`${this.apiUrl}/list-employee/${id}`);
    }

    addEmployee(employee: EmployeeModel): Observable<EmployeeModel> {
        return this.http.post<EmployeeModel>(`${this.apiUrl}/add-employee`, employee);
    }

    deleteEmployee(id: string): Observable<any> {
        console.log('Deleting employee with ID:', id); // Debugging

        return this.http.delete<any>(
            `${this.apiUrl}/delete-employee/${id}`,
            this.httpOptions
        );
    }

    updateEmployee(id: string, employee: EmployeeModel): Observable<EmployeeModel> {
        console.log('Editing employee with ID:', id, 'Data:', employee); // Debugging

        return this.http.put<EmployeeModel>(
            `${this.apiUrl}/edit-employee/${id}`,
            employee,
            this.httpOptions
        );
    }
}