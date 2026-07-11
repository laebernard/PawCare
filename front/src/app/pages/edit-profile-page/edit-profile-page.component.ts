import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.css'],
})
export class EditProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      return;
    }

    this.auth.fetchCurrentUser().subscribe((loadedUser) => {
      if (loadedUser) {
        this.form.patchValue({
          firstName: loadedUser.firstName,
          lastName: loadedUser.lastName,
          email: loadedUser.email,
        });
      }
    });
  }

  fieldError(name: 'firstName' | 'lastName' | 'email'): string | null {
    const control = this.form.get(name);
    if (!control || !control.invalid || !control.touched) {
      return null;
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire.';
    }

    if (control.errors?.['email']) {
      return 'Adresse e-mail invalide.';
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
      firstName: (this.form.value.firstName ?? '').trim(),
      lastName: (this.form.value.lastName ?? '').trim(),
      email: (this.form.value.email ?? '').trim(),
    };

    this.submitting.set(true);
    this.auth.updateProfile(payload).subscribe({
      next: (response) => {
        this.submitting.set(false);
        if (response.success) {
          this.successMessage.set(response.message ?? 'Modifications enregistrées avec succès.');
          return;
        }

        this.errorMessage.set(response.message ?? 'Impossible d\'enregistrer vos modifications.');
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
          'Une erreur est survenue lors de la mise à jour de votre profil.';
        this.errorMessage.set(backendMessage);
      },
    });
  }

  goToUpdatePassword(): void {
    this.router.navigate(['/dashboard/update-password']);
  }
}
