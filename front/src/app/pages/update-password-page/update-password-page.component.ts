import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmNewPassword = control.get('confirmNewPassword');

  if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-update-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password-page.component.html',
  styleUrls: ['./update-password-page.component.css'],
})
export class UpdatePasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: passwordMatch },
  );

  fieldError(name: 'currentPassword' | 'newPassword' | 'confirmNewPassword'): string | null {
    const control = this.form.get(name);
    if (!control || !control.touched) {
      return null;
    }

    if (name === 'confirmNewPassword' && this.form.errors?.['passwordMismatch']) {
      return 'Les mots de passe ne correspondent pas.';
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire.';
    }

    if (control.errors?.['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Minimum ${min} caractères requis.`;
    }

    return null;
  }

  onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Veuillez corriger les champs en erreur avant de continuer.');
      return;
    }

    const payload = {
      currentPassword: this.form.value.currentPassword ?? '',
      newPassword: this.form.value.newPassword ?? '',
    };

    this.submitting.set(true);
    this.auth.updatePassword(payload).subscribe({
      next: (response) => {
        this.submitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message ?? 'Mot de passe mis à jour avec succès.');
          this.form.reset();
          return;
        }

        this.errorMessage.set(response.message ?? 'Impossible de mettre à jour le mot de passe.');
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);

        if (error.status === 401) {
          this.router.navigate(['/sign-in']);
          return;
        }

        const backendMessage =
          (typeof error.error === 'object' && error.error?.message) ||
          error.message ||
          'Une erreur est survenue lors de la mise à jour du mot de passe.';
        this.errorMessage.set(backendMessage);
      },
    });
  }
}
