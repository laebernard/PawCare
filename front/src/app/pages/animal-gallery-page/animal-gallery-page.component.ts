import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LucideImagePlus } from '@lucide/angular';
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
  imports: [CommonModule, DesignSystemModule, LucideImagePlus],
  templateUrl: './animal-gallery-page.component.html',
  styleUrls: ['./animal-gallery-page.component.css'],
})
export class AnimalGalleryPageComponent {
  @ViewChild('addPhotoModal') addPhotoModal?: ElementRef<HTMLElement>;

  animal: AnimalGallery | null = null;
  addPhotoModalOpen = false;
  newPhotoTitle = '';
  newPhotoFile: File | null = null;
  uploadVisualState: 'idle' | 'success' = 'idle';
  currentAnimalId = 1;
  private addPhotoTriggerElement: HTMLElement | null = null;

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

  @HostListener('document:keydown', ['$event'])
  handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.addPhotoModalOpen) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeAddPhotoModal();
      return;
    }

    if (event.key === 'Tab') {
      this.trapModalFocus(event);
    }
  }

  openAddPhotoModal(): void {
    this.addPhotoTriggerElement = document.activeElement as HTMLElement;
    this.addPhotoModalOpen = true;
    setTimeout(() => this.focusFirstModalElement());
  }

  closeAddPhotoModal(): void {
    this.addPhotoModalOpen = false;
    this.newPhotoTitle = '';
    this.newPhotoFile = null;
    this.uploadVisualState = 'idle';
    this.addPhotoTriggerElement?.focus();
    this.addPhotoTriggerElement = null;
  }

  onAddPhotoBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeAddPhotoModal();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPhotoFile = input.files?.[0] ?? null;
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

  private focusFirstModalElement(): void {
    const modalElement = this.addPhotoModal?.nativeElement;

    if (!modalElement) {
      return;
    }

    const focusableElements = this.getFocusableModalElements(modalElement);
    const firstFocusableElement = focusableElements[0];

    if (firstFocusableElement) {
      firstFocusableElement.focus();
      return;
    }

    modalElement.focus();
  }

  private trapModalFocus(event: KeyboardEvent): void {
    const modalElement = this.addPhotoModal?.nativeElement;

    if (!modalElement) {
      return;
    }

    const focusableElements = this.getFocusableModalElements(modalElement);

    if (focusableElements.length === 0) {
      event.preventDefault();
      modalElement.focus();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }

  private getFocusableModalElements(container: HTMLElement): HTMLElement[] {
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  }
}
