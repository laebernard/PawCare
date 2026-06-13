import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../services/auth.service';

type PetType = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'OTHER';

interface AnimalProfile {
  id: number;
  name: string;
  type: PetType;
  breed: string;
  photoUrl: string | null;
  color: string;
}

interface NewAnimalFormModel {
  name: string;
  type: PetType | '';
  breed: string;
  birthDate: string;
  color: string;
  weight: string;
  identification: string;
  sterilized: '' | 'yes' | 'no';
  profilePhoto: File | null;
}

const TYPE_LABELS: Record<PetType, string> = {
  DOG: 'Chien',
  CAT: 'Chat',
  BIRD: 'Oiseau',
  RABBIT: 'Lapin',
  HAMSTER: 'Hamster',
  OTHER: 'Autre',
};

@Component({
  selector: 'app-animal-profile-selector-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule, RouterLink],
  templateUrl: './animal-profile-selector-page.component.html',
  styleUrls: ['./animal-profile-selector-page.component.css'],
})
export class AnimalProfileSelectorPageComponent implements OnInit {
  profiles = signal<AnimalProfile[]>([]);
  selectedProfile = signal<AnimalProfile | null>(null);
  isAddAnimalModalOpen = false;
  newAnimalForm: NewAnimalFormModel = this.createEmptyForm();
  private addCardTriggerElement: HTMLElement | null = null;

  constructor(
    private readonly petService: PetService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.petService.getPetsByUser(String(userId)).subscribe({
      next: (pets) => {
        this.profiles.set(
          pets.map((p) => ({
            id: p.id!,
            name: p.name,
            type: p.type,
            breed: p.breed ?? '',
            photoUrl: p.imageUrl ?? null,
            color: p.color ?? '',
          })),
        );
      },
      error: (err) => console.error('Erreur chargement pets', err),
    });
  }

  getTypeLabel(type: PetType): string {
    return TYPE_LABELS[type] ?? type;
  }

  selectProfile(profile: AnimalProfile): void {
    this.selectedProfile.set(profile);
  }

  openAddAnimalModal(): void {
    this.addCardTriggerElement = document.activeElement as HTMLElement;
    this.isAddAnimalModalOpen = true;
  }

  closeAddAnimalModal(): void {
    this.isAddAnimalModalOpen = false;
    this.newAnimalForm = this.createEmptyForm();
    this.addCardTriggerElement?.focus();
    this.addCardTriggerElement = null;
  }

  onProfilePhotoSelected(file: File | null): void {
    this.newAnimalForm = {
      ...this.newAnimalForm,
      profilePhoto: file,
    };
  }

  onFieldInput(
    field: keyof Omit<NewAnimalFormModel, 'profilePhoto' | 'sterilized' | 'type'>,
    event: Event,
  ): void {
    const input = event.target as HTMLInputElement;
    this.newAnimalForm = {
      ...this.newAnimalForm,
      [field]: input.value,
    };
  }

  onSterilizedChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.newAnimalForm = {
      ...this.newAnimalForm,
      sterilized: select.value as NewAnimalFormModel['sterilized'],
    };
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.newAnimalForm = {
      ...this.newAnimalForm,
      type: select.value as NewAnimalFormModel['type'],
    };
  }

  isAddAnimalFormValid(): boolean {
    return (
      this.newAnimalForm.name.trim().length > 0 &&
      this.newAnimalForm.type !== '' &&
      this.newAnimalForm.breed.trim().length > 0 &&
      this.newAnimalForm.birthDate.trim().length > 0 &&
      this.isBirthDateValid() &&
      this.newAnimalForm.color.trim().length > 0 &&
      this.newAnimalForm.weight.trim().length > 0 &&
      this.newAnimalForm.identification.trim().length > 0 &&
      this.newAnimalForm.sterilized !== '' &&
      this.newAnimalForm.profilePhoto !== null
    );
  }

  isBirthDateValid(): boolean {
    if (!this.newAnimalForm.birthDate) return false;

    const today = new Date();
    const birthDate = new Date(this.newAnimalForm.birthDate);

    today.setHours(0, 0, 0, 0);
    birthDate.setHours(0, 0, 0, 0);

    return birthDate <= today;
  }

  submitAddAnimalForm(event: Event): void {
    event.preventDefault();

    if (!this.isAddAnimalFormValid()) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    if (this.newAnimalForm.profilePhoto) {
      this.uploadImageAndCreatePet(userId);
    } else {
      this.createPetWithoutImage(userId);
    }
  }

  private uploadImageAndCreatePet(userId: number): void {
    this.petService.uploadImage(this.newAnimalForm.profilePhoto!).subscribe({
      next: (imageUrl: string) => {
        const pet = this.buildPetPayload(userId, imageUrl);
        this.createPet(pet);
      },
      error: (err) => console.error('Erreur upload image', err),
    });
  }

  private createPetWithoutImage(userId: number): void {
    const pet = this.buildPetPayload(userId, null);
    this.createPet(pet);
  }

  private buildPetPayload(userId: number, imageUrl: string | null) {
    return {
      userId: String(userId),
      name: this.newAnimalForm.name.trim(),
      type: this.newAnimalForm.type as PetType,
      breed: this.newAnimalForm.breed.trim(),
      birthDate: this.newAnimalForm.birthDate,
      color: this.newAnimalForm.color.trim(),
      weight: Number(this.newAnimalForm.weight),
      identification: this.newAnimalForm.identification.trim(),
      sterilized: this.newAnimalForm.sterilized === 'yes',
      imageUrl,
    };
  }

  private createPet(pet: ReturnType<typeof this.buildPetPayload>): void {
    this.petService.createPet(pet).subscribe({
      next: (createdPet) => {
        this.profiles.update((current) => [
          ...current,
          {
            id: createdPet.id!,
            name: createdPet.name,
            type: createdPet.type,
            breed: createdPet.breed ?? '',
            color: createdPet.color ?? '',
            photoUrl: createdPet.imageUrl ?? null,
          },
        ]);
        this.closeAddAnimalModal();
      },
      error: (err) => console.error('Erreur création pet', err),
    });
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  private createEmptyForm(): NewAnimalFormModel {
    return {
      name: '',
      type: '',
      breed: '',
      birthDate: '',
      color: '',
      weight: '',
      identification: '',
      sterilized: '',
      profilePhoto: null,
    };
  }
}
