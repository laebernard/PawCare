import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export type ExpenseCategory =
  | 'VETERINARY'
  | 'FOOD'
  | 'ACCESSORIES'
  | 'GROOMING'
  | 'INSURANCE'
  | 'MEDICATION'
  | 'TRAINING'
  | 'BOARDING'
  | 'OTHER';

export interface Expense {
  id: number;
  petId: number;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note: string | null;
  createdAt: string;
}

export interface CreateExpenseRequest {
  petId: number;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getExpenses(petId: number, month?: string): Observable<Expense[]> {
    let params = new HttpParams().set('petId', String(petId));
    if (month) {
      params = params.set('month', month);
    }

    return this.http.get<Expense[]>(`${this.baseUrl}/expenses`, { params });
  }

  createExpense(payload: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/expenses`, payload);
  }
}
