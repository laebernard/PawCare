import { Injectable, signal, computed } from '@angular/core';

export type PetType = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'OTHER';

export interface AnimalProfile {
  id: number;
  name: string;
  type: PetType;
  breed: string;
  photoUrl: string | null;
  color: string;
}

const STORAGE_KEY = 'selectedPetId';

@Injectable({ providedIn: 'root' })
export class SelectedPetService {
  private readonly _selectedPet = signal<AnimalProfile | null>(null);
  readonly selectedPet = this._selectedPet.asReadonly();
  readonly hasSelectedPet = computed(() => this._selectedPet() !== null);

  select(pet: AnimalProfile): void {
    localStorage.setItem(STORAGE_KEY, String(pet.id));
    this._selectedPet.set(pet);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._selectedPet.set(null);
  }
}
