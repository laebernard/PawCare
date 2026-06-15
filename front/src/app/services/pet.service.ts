import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Pet {
  id?: number;
  name: string;
  breed: string;
  birthDate: string;
  color: string;
  weight: number;
  identification: string;
  sterilized: boolean;
  imageUrl: string | null;
  type: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'OTHER';
}

@Injectable({ providedIn: 'root' })
export class PetService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/pets/upload`, formData, {
      responseType: 'text'
    });
  }

  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.baseUrl}/pets`, pet);
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/pets/${id}`);
  }

  getMyPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}/pets`);
  }
}
