import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { EmployeeService } from '../core/services/employee.service';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { createEmployeeForm } from '../shared/forms/employee-form';
import { getErrorMessage, isFieldInvalid, markFormGroupTouched } from '../shared/forms/helpers-form';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  isSubmitting = false;

  // Para manejar subscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  constructor(
    private titulo: Title,
    private employeeService: EmployeeService,
  ) {
    this.titulo.setTitle("Add Employee");
  }

  ngOnInit(): void {
    this.employeeForm = createEmployeeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.employeeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const employeeData = {
        name: this.employeeForm.get('name')?.value?.trim(),
        position: this.employeeForm.get('position')?.value?.trim(),
        email: this.employeeForm.get('email')?.value?.toLowerCase().trim(),
        phone: this.employeeForm.get('phone')?.value?.trim(),
        address: this.employeeForm.get('address')?.value?.trim()
      };

      this.employeeService.addEmployee(employeeData as EmployeeModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Employee added successfully:', response);
            alert('Empleado agregado exitosamente');
            this.onReset(); // Resetea el formulario después de agregar
          },
          error: (error) => {
            console.error('Error adding employee:', error);
            this.isSubmitting = false;
            // Aquí puedes mostrar un mensaje de error al usuario
            alert('Error al agregar empleado. Por favor, inténtalo de nuevo.');
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      markFormGroupTouched(this.employeeForm);
    }
  }

  onReset(): void {
    this.employeeForm.reset();
    this.isSubmitting = false;
  }

  getErrorMessageForField(controlName: string): string {
    return getErrorMessage(this.employeeForm, controlName);
  }

  isFieldInvalidForForm(controlName: string): boolean {
    return isFieldInvalid(this.employeeForm, controlName);
  }
}