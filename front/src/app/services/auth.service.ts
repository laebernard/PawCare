import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, map, of } from 'rxjs';

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
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.user) {
          this._currentUser.set(response.user);
        }
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        throw err;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/register`, data);
  }

  signOut(): void {
    this.selectedPetService.clear();
    this._currentUser.set(null);
  }

  fetchCurrentUser(): Observable<UserPayload | null> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/api/auth/me`).pipe(
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