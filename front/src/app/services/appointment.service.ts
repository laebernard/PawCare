import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ContactType } from './contact.service';

export interface Appointment {
  id: number;
  date: string;
  address: string;
  reason: string;
  petId: number;
  contactId: number;
  petName: string;
  contactName: string;
  contactType: ContactType;
}

export interface AppointmentRequest {
  date: string;
  address: string;
  reason: string;
  petId: number;
  contactId: number;
}

export interface AppointmentUpdateRequest {
  date: string;
  address: string;
  reason: string;
  contactId: number;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly appointments = this._appointments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  loadAppointments(): Observable<Appointment[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments`).pipe(
      tap((appointments) => {
        this._appointments.set(appointments);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Impossible de charger les rendez-vous.');
        return throwError(() => err);
      })
    );
  }

  createAppointment(payload: AppointmentRequest): Observable<Appointment> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, payload).pipe(
      tap((created) => {
        this._appointments.update((list) => [...list, created]);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Impossible de créer le rendez-vous.');
        return throwError(() => err);
      })
    );
  }

  updateAppointment(id: number, payload: AppointmentUpdateRequest): Observable<Appointment> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${id}`, payload).pipe(
      tap((updated) => {
        this._appointments.update((list) => list.map((appt) => (appt.id === id ? updated : appt)));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Impossible de modifier le rendez-vous.');
        return throwError(() => err);
      })
    );
  }

  deleteAppointment(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.baseUrl}/appointments/${id}`).pipe(
      tap(() => {
        this._appointments.update((list) => list.filter((appt) => appt.id !== id));
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Impossible de supprimer le rendez-vous.');
        return throwError(() => err);
      })
    );
  }
}
