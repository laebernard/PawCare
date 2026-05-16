import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: Replace with actual API URL when backend route is available
  private readonly API_REGISTER_URL = '/api/auth/register';

  register(data: RegisterRequest): Observable<RegisterResponse> {
    // TODO: Replace this placeholder with a real HttpClient call:
    // return this.http.post<RegisterResponse>(this.API_REGISTER_URL, data);
    console.log('[AuthService] Register payload:', data);
    console.log('[AuthService] Would POST to:', this.API_REGISTER_URL);
    return of({ success: true, message: 'Inscription réussie !' }); // Simulate network delay
  }
}
