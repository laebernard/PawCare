import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

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
  animal: AnimalGallery | null = null;
  lightboxOpen = false;
  selectedImage: AnimalGalleryImage | null = null;
  currentAnimalId = 1;

  galleries: AnimalGallery[] = [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever',
      images: [
        {
          id: 1,
          imageUrl:
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&h=700&fit=crop',
          description: 'Max in a joyful portrait.',
        },
        {
          id: 2,
          imageUrl:
            'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=900&h=700&fit=crop',
          description: 'Playtime in the grass.',
        },
        {
          id: 3,
          imageUrl:
            'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?w=900&h=700&fit=crop',
          description: 'A calm afternoon nap.',
        },
        {
          id: 4,
          imageUrl:
            'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=900&h=700&fit=crop',
          description: 'Golden hour walk by the lake.',
        },
        {
          id: 5,
          imageUrl:
            'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=900&h=700&fit=crop',
          description: 'Focused look during training.',
        },
        {
          id: 6,
          imageUrl:
            'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&h=700&fit=crop',
          description: 'Happy smile after fetch time.',
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

  openLightbox(image: AnimalGalleryImage): void {
    this.selectedImage = image;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedImage = null;
  }
}
