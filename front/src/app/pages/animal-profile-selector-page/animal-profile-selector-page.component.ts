import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DesignSystemModule } from '../../design-system/design-system.module';

interface AnimalProfile {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
  breed: string;
  photoUrl: string | null;
  color: string;
}

interface NewAnimalFormModel {
  name: string;
  breed: string;
  birthDate: string;
  color: string;
  weight: string;
  identification: string;
  sterilized: '' | 'yes' | 'no';
  profilePhoto: File | null;
}

const TYPE_LABELS: Record<string, string> = {
  dog: 'Chien',
  cat: 'Chat',
  bird: 'Oiseau',
  rabbit: 'Lapin',
  hamster: 'Hamster',
  other: 'Autre',
};

@Component({
  selector: 'app-animal-profile-selector-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule, RouterLink],
  templateUrl: './animal-profile-selector-page.component.html',
  styleUrls: ['./animal-profile-selector-page.component.css'],
})
export class AnimalProfileSelectorPageComponent {
  profiles: AnimalProfile[] = [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever',
      photoUrl:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&crop=face',
      color: 'blonde',
    },
    {
      id: 2,
      name: 'Luna',
      type: 'cat',
      breed: 'Siamese',
      photoUrl:
        'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=300&h=300&fit=crop&crop=face',
      color: 'white',
    },
    {
      id: 3,
      name: 'Charlie',
      type: 'dog',
      breed: 'French Bulldog',
      photoUrl:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop&crop=face',
      color: 'brown',
    },
  ];

  selectedProfile: AnimalProfile | null = null;
  isAddAnimalModalOpen = false;
  newAnimalForm: NewAnimalFormModel = this.createEmptyForm();
  private addCardTriggerElement: HTMLElement | null = null;

  getTypeLabel(type: string): string {
    return TYPE_LABELS[type] ?? type;
  }

  selectProfile(profile: AnimalProfile): void {
    this.selectedProfile = profile;
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

  onFieldInput(field: keyof Omit<NewAnimalFormModel, 'profilePhoto' | 'sterilized'>, event: Event): void {
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

  isAddAnimalFormValid(): boolean {
    return (
      this.newAnimalForm.name.trim().length > 0 &&
      this.newAnimalForm.breed.trim().length > 0 &&
      this.newAnimalForm.birthDate.trim().length > 0 &&
      this.newAnimalForm.color.trim().length > 0 &&
      this.newAnimalForm.weight.trim().length > 0 &&
      this.newAnimalForm.identification.trim().length > 0 &&
      this.newAnimalForm.sterilized !== '' &&
      this.newAnimalForm.profilePhoto !== null
    );
  }

  submitAddAnimalForm(event: Event): void {
    event.preventDefault();
    if (!this.isAddAnimalFormValid()) return;
    this.closeAddAnimalModal();
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  private createEmptyForm(): NewAnimalFormModel {
    return {
      name: '',
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
