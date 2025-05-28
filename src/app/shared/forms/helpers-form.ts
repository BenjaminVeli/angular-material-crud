import { FormGroup } from '@angular/forms';

export function getFieldName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
        name: 'Nombre',
        position: 'Posición',
        email: 'Email',
        phone: 'Teléfono',
        address: 'Dirección'
    };
    return fieldNames[controlName] || controlName;
}

export function getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);

    if (control?.hasError('required')) {
        return `${getFieldName(controlName)} es requerido`;
    }
    if (control?.hasError('email')) {
        return 'Email no válido';
    }
    if (control?.hasError('minlength')) {
        const minLength = control.errors?.['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
        const maxLength = control.errors?.['maxlength'].requiredLength;
        return `Máximo ${maxLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
        return 'Formato no válido';
    }
    return '';
}

export function isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
}

export function markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        control?.markAsTouched();
    });
}
