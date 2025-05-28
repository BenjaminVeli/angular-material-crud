import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { EmployeeService } from '../core/services/employee.service';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { createEmployeeForm } from '../shared/forms/employee-form';
import { getErrorMessage, isFieldInvalid, markFormGroupTouched } from '../shared/forms/helpers-form';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  isEditingEmployee = false;

  // Para manejar subscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  constructor(
    private titulo: Title,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {
    titulo.setTitle("Edit Employee");
  }

  ngOnInit(): void {
    this.employeeForm = createEmployeeForm();

    // Obtén el id de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditingEmployee = true;
      this.employeeService.getEmployeeById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (employee) => {
            // Llena el formulario con los datos recibidos
            this.employeeForm.patchValue(employee);
            this.isEditingEmployee = false;
          },
          error: (err) => {
            console.error('Error al cargar empleado:', err);
            this.isEditingEmployee = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(): void {
    if (this.employeeForm.valid && !this.isEditingEmployee) {
      this.isEditingEmployee = true;
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        alert('ID de empleado no encontrado');
        this.isEditingEmployee = false;
        return;
      }

      const employeeData = this.employeeForm.value;

      this.employeeService.updateEmployee(id, employeeData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            alert('Empleado actualizado exitosamente');
          },
          error: (error) => {
            console.error('Error al actualizar empleado:', error);
            alert('Error al actualizar empleado. Intenta de nuevo.');
            this.isEditingEmployee = false;
          },
          complete: () => {
            this.isEditingEmployee = false;
          }
        });
    } else {
      markFormGroupTouched(this.employeeForm);
    }
  }


  onReset(): void {
    this.employeeForm.reset();
    this.isEditingEmployee = false;
  }

  getErrorMessageForField(controlName: string): string {
    return getErrorMessage(this.employeeForm, controlName);
  }

  isFieldInvalidForForm(controlName: string): boolean {
    return isFieldInvalid(this.employeeForm, controlName);
  }
}
