import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: Replace with actual API URLs when backend routes are available
  private readonly API_REGISTER_URL = '/api/auth/register';
  private readonly API_SIGN_IN_URL = '/api/auth/sign-in';

  register(data: RegisterRequest): Observable<AuthResponse> {
    // TODO: return this.http.post<AuthResponse>(this.API_REGISTER_URL, data);
    console.log('[AuthService] Register payload:', data);
    console.log('[AuthService] Would POST to:', this.API_REGISTER_URL);
    return of({ success: true, message: 'Inscription réussie !' });
  }

  signIn(data: SignInRequest): Observable<AuthResponse> {
    // TODO: return this.http.post<AuthResponse>(this.API_SIGN_IN_URL, data);
    console.log('[AuthService] Sign-in payload:', data);
    console.log('[AuthService] Would POST to:', this.API_SIGN_IN_URL);
    return of({ success: true, message: 'Connexion réussie !' });
  }
}
