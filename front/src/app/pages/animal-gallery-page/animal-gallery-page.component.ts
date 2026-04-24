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
      name: 'Simba',
      type: 'cat',
      breed: 'Chat Orange',
      images: [
        {
          id: 1,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=11',
          description: 'Portrait de Simba.',
        },
        {
          id: 2,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=12',
          description: 'Pause tranquille.',
        },
        {
          id: 3,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=23',
          description: 'Sieste douce.',
        },
        {
          id: 4,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=24',
          description: 'Exploration.',
        },
        {
          id: 5,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=25',
          description: 'Regard attentif.',
        },
        {
          id: 6,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=26',
          description: 'Moment calme.',
        },
        {
          id: 7,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=27',
          description: 'Petit bond.',
        },
        {
          id: 8,
          imageUrl:
            'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=900&h=700&fit=crop',
          description: 'Repos au soleil.',
        },
        {
          id: 9,
          imageUrl: 'https://loremflickr.com/900/700/orange,cat?lock=29',
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

  openLightbox(image: AnimalGalleryImage): void {
    this.selectedImage = image;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedImage = null;
  }
}
