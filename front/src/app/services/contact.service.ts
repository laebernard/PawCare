import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

export type ContactType = 'VET' | 'GROOMER' | 'PET_SITTER' | 'OTHER';

export interface Contact {
  id: number;
  name: string;
  type: ContactType | null;
  phone: string | null;
  address: string | null;
}

@Injectable({ providedIn: 'root' })
export class ContactService {

  private readonly baseUrl = environment.apiUrl;

  private readonly _contacts = signal<Contact[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly contacts = this._contacts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private readonly http: HttpClient) {}

  loadContacts(): Observable<Contact[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Contact[]>(`${this.baseUrl}/contacts`).pipe(
      tap(contacts => {
        this._contacts.set(contacts);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        this._error.set('Impossible de charger les contacts.');
        return throwError(() => err);
      })
    );
  }
}
