import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../../design-system/title/title.component';
import { PASSWORD_PATTERN, PASSWORD_ERROR_MESSAGE } from '../../validators/password.validator';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideHeart, TitleComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css'],
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatch },
  );

  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  private readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';

  fieldError(name: string): string | null {
    const control = this.form.get(name);
    if (!control) return null;

    if (name === 'confirmPassword' && this.form.errors?.['passwordMismatch'] && control.touched) {
      return 'Les mots de passe ne correspondent pas.';
    }

    if (!control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'Ce champ est obligatoire.';
    if (control.errors?.['minlength']) return 'Le mot de passe doit contenir au moins 8 caracteres.';
    if (control.errors?.['pattern']) return PASSWORD_ERROR_MESSAGE;
    return null;
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.token) {
      this.errorMessage.set('Token de reinitialisation manquant ou invalide.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { password } = this.form.value;

    this.auth.resetPassword({ token: this.token, password }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message ?? 'Mot de passe reinitialise avec succes.');
        } else {
          this.errorMessage.set(response.message ?? 'Une erreur est survenue.');
        }
      },
      error: (err) => {
        this.submitting.set(false);
        const backendMessage =
          err?.error?.message ??
          err?.message ??
          'Une erreur est survenue. Veuillez reessayer.';
        this.errorMessage.set(backendMessage);
      },
    });
  }
}
