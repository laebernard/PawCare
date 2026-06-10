import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  submitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  fieldError(name: string): string | null {
    const control = this.form.get(name);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'Ce champ est obligatoire.';
    if (control.errors?.['email']) return 'Adresse e-mail invalide.';
    return null;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { email, password } = this.form.value;

    this.auth.signIn({ email, password }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.success) {
          this.successMessage.set(res.message);
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
      },
    });
  }
}
