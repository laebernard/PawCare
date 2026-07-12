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

const STORAGE_KEY_ID = 'selectedPetId';
const STORAGE_KEY_PET = 'selectedPet';

@Injectable({ providedIn: 'root' })
export class SelectedPetService {
  private readonly _selectedPet = signal<AnimalProfile | null>(null);
  readonly selectedPet = this._selectedPet.asReadonly();
  readonly hasSelectedPet = computed(() => this._selectedPet() !== null);

  constructor() {
    this.restoreFromStorage();
  }

  select(pet: AnimalProfile): void {
    localStorage.setItem(STORAGE_KEY_ID, String(pet.id));
    localStorage.setItem(STORAGE_KEY_PET, JSON.stringify(pet));
    this._selectedPet.set(pet);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY_ID);
    localStorage.removeItem(STORAGE_KEY_PET);
    this._selectedPet.set(null);
  }

  private restoreFromStorage(): void {
    try {
      const rawPet = localStorage.getItem(STORAGE_KEY_PET);
      if (rawPet) {
        const parsedPet = JSON.parse(rawPet) as AnimalProfile;
        if (!parsedPet || typeof parsedPet.id !== 'number') {
          this.clear();
          return;
        }

        this._selectedPet.set(parsedPet);
        return;
      }

      // Backward compatibility: older versions stored only the pet id.
      const rawId = localStorage.getItem(STORAGE_KEY_ID);
      const id = rawId ? Number(rawId) : NaN;
      if (!Number.isFinite(id)) {
        return;
      }

      this._selectedPet.set({
        id,
        name: 'Compagnon',
        type: 'OTHER',
        breed: '',
        photoUrl: null,
        color: '',
      });
    } catch {
      this.clear();
    }
  }
}
