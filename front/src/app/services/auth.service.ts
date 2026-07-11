import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, map, of, switchMap } from 'rxjs';

import { environment } from '../../environments/environment';
import { SelectedPetService } from './selected-pet.service';

export interface UserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserPayload;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  private readonly _currentUser = signal<UserPayload | null>(null);
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor(
    private readonly http: HttpClient,
    private readonly selectedPetService: SelectedPetService,
  ) {}

  signIn(credentials: SignInRequest): Observable<AuthResponse> {
    this._loading.set(true);

    return this.http.post<AuthResponse>(`${this.baseUrl}/api/login`, credentials, { withCredentials: true }).pipe(
      switchMap(response => {
        if (!response.success) {
          this._loading.set(false);
          return of(response);
        }

        // 🔥 Récupère le vrai user depuis le backend
        return this.fetchCurrentUser().pipe(
          map(() => response)
        );
      }),
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        throw err;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/register`, data, { withCredentials: true });
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/forgot-password`, data, { withCredentials: true });
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/reset-password`, data, { withCredentials: true });
  }

  signOut(): void {
    this.selectedPetService.clear();
    this._currentUser.set(null);
  }

  fetchCurrentUser(): Observable<UserPayload | null> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/api/auth/me`, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this._currentUser.set(response.user);
        }
      }),
      map(response => response.success ? response.user ?? null : null),
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    );
  }
}
