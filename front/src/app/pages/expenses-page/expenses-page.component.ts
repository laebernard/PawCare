import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Expense, ExpenseCategory, ExpenseService } from '../../services/expense.service';
import { SelectedPetService } from '../../services/selected-pet.service';

interface CategoryOption {
  value: ExpenseCategory;
  label: string;
  color: string;
  icon: string;
}

interface CategoryTotal {
  category: ExpenseCategory;
  label: string;
  color: string;
  icon: string;
  amount: number;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'VETERINARY', label: 'Vétérinaire', color: '#ff6b6b', icon: '🩺' },
  { value: 'FOOD', label: 'Nourriture', color: '#4ecdc4', icon: '🥣' },
  { value: 'ACCESSORIES', label: 'Accessoires', color: '#5f6caf', icon: '🧸' },
  { value: 'GROOMING', label: 'Toilettage', color: '#f7b267', icon: '✂️' },
  { value: 'INSURANCE', label: 'Assurance', color: '#9d4edd', icon: '🛡️' },
  { value: 'MEDICATION', label: 'Médicaments', color: '#43aa8b', icon: '💊' },
  { value: 'TRAINING', label: 'Éducation', color: '#277da1', icon: '🎓' },
  { value: 'BOARDING', label: 'Garde', color: '#f3722c', icon: '🏠' },
  { value: 'OTHER', label: 'Autre', color: '#6c757d', icon: '✨' },
];

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.css'],
})
export class ExpensesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly expenseService = inject(ExpenseService);
  private readonly selectedPetService = inject(SelectedPetService);

  readonly categories = CATEGORY_OPTIONS;
  readonly selectedPet = this.selectedPetService.selectedPet;

  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly expenses = signal<Expense[]>([]);
  readonly selectedMonth = signal(this.currentYearMonth());

  readonly form = this.fb.group({
    category: ['', [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [this.currentDate(), [Validators.required]],
    note: [''],
  });

  readonly totalsByCategory = computed<CategoryTotal[]>(() => {
    const totals = new Map<ExpenseCategory, number>();
    for (const category of CATEGORY_OPTIONS) {
      totals.set(category.value, 0);
    }

    for (const expense of this.expenses()) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + Number(expense.amount));
    }

    return CATEGORY_OPTIONS.map((category) => ({
      category: category.value,
      label: category.label,
      color: category.color,
      icon: category.icon,
      amount: Number((totals.get(category.value) ?? 0).toFixed(2)),
    }));
  });

  readonly totalAmount = computed(() => {
    const total = this.expenses().reduce((sum, expense) => sum + Number(expense.amount), 0);
    return Number(total.toFixed(2));
  });

  readonly pieChartBackground = computed(() => {
    const totals = this.totalsByCategory().filter(item => item.amount > 0);
    const total = this.totalAmount();

    if (total <= 0 || totals.length === 0) {
      return 'conic-gradient(#ececec 0deg 360deg)';
    }

    let currentAngle = 0;
    const slices: string[] = [];

    for (const item of totals) {
      const sliceAngle = (item.amount / total) * 360;
      const nextAngle = currentAngle + sliceAngle;
      slices.push(`${item.color} ${currentAngle.toFixed(2)}deg ${nextAngle.toFixed(2)}deg`);
      currentAngle = nextAngle;
    }

    return `conic-gradient(${slices.join(', ')})`;
  });

  private readonly refreshExpensesEffect = effect(() => {
    const pet = this.selectedPet();
    const month = this.selectedMonth();

    if (!pet) {
      this.expenses.set([]);
      return;
    }

    this.loadExpensesFor(pet.id, month);
  });

  fieldError(name: 'category' | 'amount' | 'date'): string | null {
    const control = this.form.get(name);
    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    if (control.errors?.['required']) {
      return 'Ce champ est obligatoire.';
    }

    if (name === 'amount' && control.errors?.['min']) {
      return 'Le montant doit être un nombre positif.';
    }

    return null;
  }

  onMonthChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMonth.set(input.value || this.currentYearMonth());
  }

  onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Tous les champs sont obligatoires pour enregistrer la dépense.');
      return;
    }

    const pet = this.selectedPet();
    if (!pet) {
      this.errorMessage.set('Veuillez d\'abord sélectionner un compagnon.');
      return;
    }

    const payload = {
      petId: pet.id,
      category: this.form.value.category as ExpenseCategory,
      amount: Number(this.form.value.amount),
      date: this.form.value.date as string,
      note: (this.form.value.note ?? '').trim() || null,
    };

    this.submitting.set(true);
    this.expenseService.createExpense(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Dépense enregistrée avec succès.');
        this.form.patchValue({
          amount: null,
          note: '',
          date: this.currentDate(),
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
        const petId = this.selectedPet()?.id;
        if (petId) {
          this.loadExpensesFor(petId, this.selectedMonth());
        }
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        const message =
          (typeof error.error === 'object' && error.error?.message) ||
          error.message ||
          'Impossible d\'enregistrer la dépense.';
        this.errorMessage.set(message);
      },
    });
  }

  private loadExpensesFor(petId: number, month: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.expenseService.getExpenses(petId, month).subscribe({
      next: (expenses) => {
        this.loading.set(false);
        this.expenses.set(expenses);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        const message =
          (typeof error.error === 'object' && error.error?.message) ||
          error.message ||
          'Impossible de charger les dépenses.';
        this.errorMessage.set(message);
      },
    });
  }

  private currentDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private currentYearMonth(): string {
    return new Date().toISOString().slice(0, 7);
  }
}
