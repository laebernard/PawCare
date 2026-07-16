import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { SelectedPetService } from '../../services/selected-pet.service';
import { inject } from '@angular/core';

interface AnimalGalleryImage {
  id: number;
  imageUrl: string;
  description: string;
}

interface AnimalGallery {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
  breed: string;
  images: AnimalGalleryImage[];
}

@Component({
  selector: 'app-animal-gallery-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './animal-gallery-page.component.html',
  styleUrls: ['./animal-gallery-page.component.css'],
})
export class AnimalGalleryPageComponent {
  private readonly selectedPetService = inject(SelectedPetService);
  animal: AnimalGallery | null = null;
  addPhotoModalOpen = false;
  newPhotoTitle = '';
  newPhotoFile: File | null = null;
  uploadVisualState: 'idle' | 'success' = 'idle';
  currentAnimalId = 1;
  private addPhotoTriggerElement: HTMLElement | null = null;

pet = this.selectedPetService.selectedPet();

  galleries: AnimalGallery[] = [
    {
      id: 1,
      name: this.pet!.name,
      type: 'cat',
      breed: 'Chat Orange',
      images: [
        {
          id: 1,
          imageUrl: 'https://www.lepoint.fr/resizer/v2/HQKSKBVLRVMRPDVDI474XS3DXA.jpg?auth=56740f3084a208366e77179cf6d8d1c2733b59a16bb45f1d37b336af5d9179a7&width=765&height=575&smart=true',
          description: 'Portrait de Simba.',
        },
        {
          id: 2,
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5Wtv0sewQJnFlclCG2H7PPrQWRKY7MHuGPH5VpW5fgEOlb_15yRKK4H77&s=10',
          description: 'Pause tranquille.',
        },
        {
          id: 3,
          imageUrl: 'https://www.everland-petfood.com/wp-content/uploads/AdobeStock_203576107.jpeg',
          description: 'Sieste douce.',
        },
        {
          id: 4,
          imageUrl: 'https://binette-et-jardin.ouest-france.fr/images/dossiers/2017-10/european-shorthair-2-144713.jpg',
          description: 'Exploration.',
        },
        {
          id: 5,
          imageUrl: 'https://cdn.histoires-animaux.com/Shutterstock_2335634991_328a3b1bcf.jpg',
          description: 'Regard attentif.',
        },
        {
          id: 6,
          imageUrl: 'https://cdn.wamiz.fr/cdn-cgi/image/format=auto,quality=80,width=1200,height=675,fit=cover/animal/breed/cat/adult/66bf107d15515177495239.jpg',
          description: 'Moment calme.',
        },
        {
          id: 7,
          imageUrl: 'https://www.bullebleue.fr/wp-content/uploads/sites/2/2025/02/chat_europeen.jpg',
          description: 'Petit bond.',
        },
        {
          id: 8,
          imageUrl:
            'https://www.santevet.com/wp-content/uploads/2009/06/chat_europ_en_assurance_santevet-768x508.jpeg',
          description: 'Repos au soleil.',
        },
        {
          id: 9,
          imageUrl: 'https://www.santevet.com/wp-content/uploads/2021/02/chat_europeen_ou_chat_de_gouttiere.jpg',
          description: 'Vue de profil.',
        },
      ],
    }
  ];

  constructor() {
    this.loadCurrentAnimal();
  }

  loadCurrentAnimal(): void {
    this.animal = this.galleries.find((gallery) => gallery.id === this.currentAnimalId) ?? null;
  }

  openAddPhotoModal(): void {
    this.addPhotoTriggerElement = document.activeElement as HTMLElement;
    this.addPhotoModalOpen = true;
  }

  closeAddPhotoModal(): void {
    this.addPhotoModalOpen = false;
    this.newPhotoTitle = '';
    this.newPhotoFile = null;
    this.uploadVisualState = 'idle';
    this.addPhotoTriggerElement?.focus();
    this.addPhotoTriggerElement = null;
  }

  onFileSelected(file: File | null): void {
    this.newPhotoFile = file;
    this.uploadVisualState = 'idle';
  }

  onTitleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPhotoTitle = input.value;
    this.uploadVisualState = 'idle';
  }

  isAddPhotoFormValid(): boolean {
    return this.newPhotoTitle.trim().length > 0 && this.newPhotoFile !== null;
  }

  submitAddPhotoForm(event: Event): void {
    event.preventDefault();

    if (!this.isAddPhotoFormValid()) {
      return;
    }

    this.uploadVisualState = 'success';
  }
}
