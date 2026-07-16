import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck, LucideX } from '@lucide/angular';

interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

@Component({
  selector: 'ds-password-requirements',
  standalone: true,
  imports: [CommonModule, LucideCheck, LucideX],
  templateUrl: './password-requirements.component.html',
  styleUrls: ['./password-requirements.component.css'],
})
export class PasswordRequirementsComponent {
  @Input() password = '';

  readonly requirements: PasswordRequirement[] = [
    { label: 'Au moins 8 caractères', test: (v) => v.length >= 8 },
    { label: 'Une lettre majuscule', test: (v) => /[A-Z]/.test(v) },
    { label: 'Une lettre minuscule', test: (v) => /[a-z]/.test(v) },
    { label: 'Un chiffre', test: (v) => /\d/.test(v) },
    { label: 'Un symbole (ex: ! @ # $ %)', test: (v) => /[^a-zA-Z0-9]/.test(v) },
  ];

  isValid(requirement: PasswordRequirement): boolean {
    return requirement.test(this.password ?? '');
  }
}
