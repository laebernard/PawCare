import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../../design-system/title/title.component';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideHeart, TitleComponent],
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
})
export class SignInPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submitting = false;
  errorMessage = '';
  successMessage = '';

  fieldError(name: string): string | null {
    const control = this.form.get(name);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'Ce champ est obligatoire.';
    if (control.errors?.['email']) return 'Adresse e-mail invalide.';
    return null;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { email, password } = this.form.value;

    this.auth.signIn({ email, password }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = res.message;
        // TODO: Redirect after sign-in
        // this.router.navigate(['/select-profile']);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      },
    });
  }
}
