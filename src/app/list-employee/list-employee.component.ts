import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from '../model/Employee';
import { Title } from '@angular/platform-browser';
import { EmployeeService } from '../core/services/employee.service';
import { NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SearchComponent } from '../shared/components/search/search.component';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [
    SearchComponent,
    RouterLink,
    ReactiveFormsModule,
    NgFor,
    NgIf
  ],

  // Sin providers - HttpClient viene de main.ts
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss'
})
export class ListEmployeeComponent implements OnInit, OnDestroy {
  // Lista completa de empleados (sin filtrar)
  allEmployees: EmployeeModel[] = [];

  // Lista filtrada que se muestra en la tabla
  employeeList: EmployeeModel[] = [];

  // Término de búsqueda actual
  currentSearchTerm: string = '';

  isLoading = false;
  deletingEmployeeId: string | null = null;

  // Para manejar subscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  constructor(
    private titulo: Title,
    private employeeService: EmployeeService
  ) {
    this.titulo.setTitle("List Employee");
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees()
      .pipe(takeUntil(this.destroy$)) // Evita memory leaks
      .subscribe({
        next: (data: EmployeeModel[]) => {
          this.allEmployees = data;
          this.employeeList = [...data];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading = false;

          // Manejo específico de errores
          let errorMessage = 'Error al cargar empleados.';

          if (error.status === 0) {
            errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage);
        }
      });
  }

  onDelete(_id: string): void {
    // Validar que el ID existe
    if (!_id) {
      alert('Error: ID de empleado no válido.');
      return;
    }

    // Confirmar eliminación
    const employee = this.employeeList.find(emp => emp._id === _id);
    const employeeName = employee?.name || 'este empleado';

    if (confirm(`¿Estás seguro de eliminar a ${employeeName}? Esta acción no se puede deshacer.`)) {
      this.deletingEmployeeId = _id; // Para mostrar loading en el botón específico

      this.employeeService.deleteEmployee(_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Employee deleted successfully');

            // Eliminar de la lista local sin recargar todo
            this.employeeList = this.employeeList.filter(emp => emp._id !== _id);

            // Mostrar mensaje de éxito
            alert(`${employeeName} ha sido eliminado exitosamente.`);

            this.deletingEmployeeId = null;
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            this.deletingEmployeeId = null;

            // Manejo específico de errores de eliminación
            let errorMessage = 'Error al eliminar empleado. Por favor, inténtalo de nuevo.';

            if (error.status === 404) {
              errorMessage = 'El empleado no existe o ya fue eliminado.';
              // Recargar la lista para sincronizar
              this.loadEmployees();
            } else if (error.status === 400) {
              errorMessage = 'No se puede eliminar este empleado. Verifica que no tenga registros dependientes.';
            } else if (error.status === 500) {
              errorMessage = 'Error interno del servidor. Contacta al administrador.';
            } else if (error.status === 0) {
              errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            alert(errorMessage);
          }
        });
    }
  }

  // Método helper para verificar si un empleado específico se está eliminando
  isDeletingEmployee(_id: string): boolean {
    return this.deletingEmployeeId === _id;
  }

  // Método para refrescar la lista manualmente
  refreshList(): void {
    this.loadEmployees();
  }

  // Método de búsqueda que filtra localmente
  onSearch(term: string): void {
    this.currentSearchTerm = term;
    this.applyFilter();
  }

  // Método para aplicar el filtro
  private applyFilter(): void {
    if (!this.currentSearchTerm || this.currentSearchTerm.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos
      this.employeeList = [...this.allEmployees];
    } else {
      // Filtrar por múltiples campos
      const searchTerm = this.currentSearchTerm.toLowerCase().trim();
      
      this.employeeList = this.allEmployees.filter(employee => 
        (employee.name?.toLowerCase().includes(searchTerm))
      );
    }
  }

  // Método para limpiar la búsqueda
  clearSearch(): void {
    this.currentSearchTerm = '';
    this.applyFilter();
  }


  // Getter para mostrar información de resultados
  get searchResultsInfo(): string {
    if (this.currentSearchTerm) {
      return `Mostrando ${this.employeeList.length} de ${this.allEmployees.length} empleados`;
    }
    return `Total de empleados: ${this.employeeList.length}`;
  }

  // Método para verificar si hay resultados de búsqueda
  get hasSearchResults(): boolean {
    return this.currentSearchTerm !== '' && this.employeeList.length > 0;
  }

  // Método para verificar si la búsqueda no tiene resultados
  get noSearchResults(): boolean {
    return this.currentSearchTerm !== '' && this.employeeList.length === 0;
  }
}