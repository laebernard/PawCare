import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

import { AuthService } from '../../services/auth.service';
import { TitleComponent } from '../../design-system/title/title.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideHeart, TitleComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  fieldError(name: string): string | null {
    const control = this.form.get(name);
    if (!control || !control.invalid || !control.touched) return null;
    if (control.errors?.['required']) return 'champs obligatoire';
    if (control.errors?.['email']) return 'email invalide';
    return null;
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { email } = this.form.value;

    this.auth.forgotPassword({ email }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message ?? 'Si cet email existe, un lien de reinitialisation a ete envoye.');
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
