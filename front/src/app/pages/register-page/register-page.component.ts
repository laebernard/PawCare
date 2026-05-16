import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../../design-system/title/title.component';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideHeart,
    TitleComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatch },
  );

  submitting = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  get f() {
    return this.form.controls;
  }

  fieldError(name: string): string | null {
    const control = this.form.get(name);
    if (!control || (!control.invalid && !this.form.errors?.['passwordMismatch'])) return null;
    if (name === 'confirmPassword' && this.form.errors?.['passwordMismatch'] && control.touched) {
      return 'Les mots de passe ne correspondent pas.';
    }
    if (!control.touched) return null;
    if (control.errors?.['required']) return 'Ce champ est obligatoire.';
    if (control.errors?.['email']) return 'Adresse e-mail invalide.';
    if (control.errors?.['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Minimum ${min} caractères requis.`;
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { firstName, lastName, email, password } = this.form.value;

    this.auth.register({ firstName, lastName, email, password }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = res.message;
        // TODO: Redirect to login page when available
        // this.router.navigate(['/login']);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      },
    });
  }
}
